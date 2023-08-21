package ee.valuutavahetus.proovitoo.config;

import ee.valuutavahetus.proovitoo.entity.User;
import ee.valuutavahetus.proovitoo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DatabaseInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    UserDetailsManager userDetailsManager;

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing database ADMIN user");
        Optional<User> adminUser = userRepository.findByUsername("admin");
        //Object doesn't exist in the database
        if (!adminUser.isPresent()) {
            //Create object
            log.info("User not found, creating new admin user");
            User newUser = new User();
            //admin user and passwird
            newUser.setUsername("admin");
            newUser.setPassword("admin");
            userDetailsManager.createUser(newUser);
            log.info("Admin user created and saved");
        }
    }
}
