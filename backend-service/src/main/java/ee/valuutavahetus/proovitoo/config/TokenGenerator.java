package ee.valuutavahetus.proovitoo.config;

import ee.valuutavahetus.proovitoo.dto.TokenDto;
import ee.valuutavahetus.proovitoo.entity.User;

import ee.valuutavahetus.proovitoo.enums.RoleName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class TokenGenerator {
    @Autowired
    JwtEncoder accessTokenEncoder;

    @Autowired
    @Qualifier("jwtRefreshTokenEncoder")
    JwtEncoder refreshTokenEncoder;

    @Autowired
    @Qualifier("jwtAccessTokenDecoder")// Inject the access token decoder bean
    private JwtDecoder accessTokenDecoder;

    @Autowired
    @Qualifier("jwtRefreshTokenDecoder")// Inject the refresh token decoder bean
    private JwtDecoder refreshTokenDecoder;

    private String createAccessToken(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        Instant now = Instant.now();

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer("valuuta vahetus")
                .issuedAt(now)
                .expiresAt(now.plus(5, ChronoUnit.MINUTES))
                .subject(user.getId())
                .build();

        return accessTokenEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
    }

    private String createRefreshToken(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        Instant now = Instant.now();

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer("valuuta vahetus")
                .issuedAt(now)
                .expiresAt(now.plus(30, ChronoUnit.MINUTES))
                .subject(user.getId())
                .build();

        return refreshTokenEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
    }

    public TokenDto createToken(Authentication authentication){
        Object principal = authentication.getPrincipal();
        if(!(principal instanceof User)){
            throw new BadCredentialsException(MessageFormat.format("Principal is not User type", authentication.getPrincipal().getClass()));
        }
        User user = (User) principal;
        TokenDto tokenDto = new TokenDto();
        tokenDto.setUserId(user.getId());
        tokenDto.setAccessToken(createAccessToken(authentication));

        String refreshToken;
        if(authentication.getCredentials() instanceof Jwt){
            Jwt jwt = (Jwt) authentication.getCredentials();
            Instant now = Instant.now();
            Instant expiresAt = jwt.getExpiresAt();
            Duration duration = Duration.between(now,expiresAt);
            long minUntilExpired = duration.toMinutes();

            if(minUntilExpired < 5 ){
                refreshToken = createRefreshToken(authentication);
            }else{
                refreshToken = jwt.getTokenValue();
            }

        }else{
            refreshToken = createRefreshToken(authentication);
        }
        tokenDto.setRefreshToken(refreshToken);
        return tokenDto;
    }

}
