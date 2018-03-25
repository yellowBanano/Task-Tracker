package by.myself.task_tracker.loader;

import by.myself.task_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * @author Nazar Kuksov
 */
@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    @Autowired
    public DatabaseLoader(UserRepository repository) {
        this.userRepository = repository;
    }

    @Override
    public void run(String... strings) throws Exception {
        this.userRepository.findAll();
    }
}
