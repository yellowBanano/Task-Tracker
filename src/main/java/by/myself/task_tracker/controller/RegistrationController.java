package by.myself.task_tracker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * @author Nazar Kuksov
 */
@Controller
public class RegistrationController {

    @GetMapping("/registration")
    public String registration() {
        return "registration";
    }
}
