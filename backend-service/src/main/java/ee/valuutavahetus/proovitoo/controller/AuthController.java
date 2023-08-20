package ee.valuutavahetus.proovitoo.controller;

import ee.valuutavahetus.proovitoo.config.TokenGenerator;
import ee.valuutavahetus.proovitoo.dto.LoginDto;
import ee.valuutavahetus.proovitoo.dto.SignupDto;
import ee.valuutavahetus.proovitoo.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Collections;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserDetailsManager userDetailsManager;

    @Autowired
    TokenGenerator tokenGenerator;

    @Autowired
    DaoAuthenticationProvider daoAuthenticationProvider;

    @Autowired
    @Qualifier("jwtRefreshTokenAuthProvider")
    JwtAuthenticationProvider refreshTokenAuthProvider;

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody SignupDto signupDto) {
        log.info("Registreerin uue kasutaja");
        User user = new User(signupDto.getUsername(), signupDto.getPassword());
        userDetailsManager.createUser(user);
        User createdUser = (User) userDetailsManager.loadUserByUsername(signupDto.getUsername());
        Authentication authentication = new UsernamePasswordAuthenticationToken(createdUser, signupDto.getPassword(), Collections.emptyList());
        log.info("Kasutaja registreerimine õnnestus");
        return ResponseEntity.ok(tokenGenerator.createToken(authentication));
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginDto loginDto) {
        log.info("Kasutaja sisse logimine");
        Authentication authentication = daoAuthenticationProvider.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(loginDto.getUsername(), loginDto.getPassword()));
        log.info("Kasutaja autenditud");
        return ResponseEntity.ok(tokenGenerator.createToken(authentication));
    }

    @PostMapping("/token")
    public ResponseEntity token(@RequestBody String refreshToken){
        log.info("Kasutaja tokeni uuendamine");
        refreshToken = refreshToken.replace("Bearer ", "");

        BearerTokenAuthenticationToken newToken = new BearerTokenAuthenticationToken(refreshToken);
        Authentication authentication = refreshTokenAuthProvider.authenticate(newToken);
        log.info("Kasutaja autenditud, tagastan uue accessToken'i");

        HttpHeaders headers = new HttpHeaders();

        return ResponseEntity.ok()
                .headers(headers)
                .body(tokenGenerator.createToken(authentication));
    }

    @RequestMapping(value = "/login", method = RequestMethod.OPTIONS)
    public void handleLoginOptions(HttpServletResponse response) {
        log.info("Options päring sisse logimiseks");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/"); // Change * to specific origins if needed
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        response.setHeader("Access-Control-Max-Age", "3600"); // Cache the preflight response for 1 hour
        log.info("Saadan tagasi päised");
    }

    @RequestMapping(value = "/token", method = RequestMethod.OPTIONS)
    public void handleTokenOptions(HttpServletResponse response) {
        log.info("Options päring tokeni saamiseks");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        response.setHeader("Access-Control-Max-Age", "3600");
        log.info("Saadan tagasi token OPTIONS päised");
    }


}
