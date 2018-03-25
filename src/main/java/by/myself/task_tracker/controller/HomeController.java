package by.myself.task_tracker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Nazar Kuksov
 */
@Controller
public class HomeController {

//    private final UserRepository userRepository;
//
//    @Autowired
//    public HomeController(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }

    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }

//    @GetMapping(path="/add")
//    public @ResponseBody String addNewUser (@RequestParam String name, @RequestParam String email) {
//
//        User n = new User();
//        n.setName(name);
//        n.setEmail(email);
//        userRepository.save(n);
//        return "Saved";
//    }
//
//    @GetMapping(path="/users")
//    public @ResponseBody
//    Iterable<User> getAllUsers() {
//        return userRepository.findAll();
//    }
}
