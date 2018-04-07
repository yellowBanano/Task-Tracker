package by.myself.task_tracker.controller;

import by.myself.task_tracker.entity.Developer;
import by.myself.task_tracker.entity.Manager;
import by.myself.task_tracker.entity.Role;
import by.myself.task_tracker.entity.User;
import by.myself.task_tracker.entity.model.UserModel;
import by.myself.task_tracker.repository.DeveloperRepository;
import by.myself.task_tracker.repository.ManagerRepository;
import by.myself.task_tracker.security.SpringDataJpaUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthorizationController {

    private final ManagerRepository managerRepository;
    private final DeveloperRepository developerRepository;
    private final UserDetailsService service;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthorizationController(SpringDataJpaUserDetailsService service, ManagerRepository managerRepository, PasswordEncoder passwordEncoder, DeveloperRepository developerRepository) {
        this.service = service;
        this.developerRepository = developerRepository;
        this.passwordEncoder = passwordEncoder;
        this.managerRepository = managerRepository;
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @PostMapping("/login")
    public String login(String username, String password) {
        UserDetails userDetails = service.loadUserByUsername(username);
        if (passwordEncoder.matches(password, userDetails.getPassword())) {
            return "redirect:/index";
        }
        return "login";
    }

    @GetMapping("/registration")
    public String registrationGet(Model model) {
        model.addAttribute("userModel", new UserModel());
        return "registration";
    }

    @PostMapping("/registration")
    public String registration(UserModel userModel, String role) {
        registerNewUser(userModel, role);
        return "redirect:/login";
    }

    private void registerNewUser(UserModel userModel, String role) {
        User user = new User();
        user.setEmail(userModel.getEmail());
        user.setPassword(passwordEncoder.encode(userModel.getPassword()));
        user.setFirstName(userModel.getFirstName());
        user.setLastName(userModel.getLastName());
        user.setRole(Role.valueOf(role));

        if (role.equals("DEVELOPER")) {
            Developer developer = new Developer(user);
            developerRepository.save(developer);
        } else if (role.equals("MANAGER")) {
            Manager manager = new Manager(user);
            managerRepository.save(manager);
        }
    }

    @PostMapping("/logout")
    public String logout() {
        return "redirect:/login";
    }


//    @Autowired
//    private IUserService service;
//
//    @RequestMapping(value = "/registrationConfirm", method = RequestMethod.GET)
//    public String confirmRegistration
//            (WebRequest request, Model model, @RequestParam("token") String token) {
//
//        Locale locale = request.getLocale();
//
//
//        VerificationToken verificationToken = service.getVerificationToken(token);
//        if (verificationToken == null) {
//            String message = messages.getMessage("auth.message.invalidToken", null, locale);
//            model.addAttribute("message", message);
//            return "redirect:/badUser.html?lang=" + locale.getLanguage();
//        }
//
//        User user = verificationToken.getUser();
//        Calendar cal = Calendar.getInstance();
//        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
//            String messageValue = messages.getMessage("auth.message.expired", null, locale)
//            model.addAttribute("message", messageValue);
//            return "redirect:/badUser.html?lang=" + locale.getLanguage();
//        }
//
//        user.setEnabled(true);
//        service.saveRegisteredUser(user);
//        return "redirect:/login.html?lang=" + request.getLocale().getLanguage();
//    }
//
//    @RequestMapping(value = "/registration", method = RequestMethod.POST)
//    @ResponseBody
//    public GenericResponse registerUserAccount(
//            @Valid UserDto accountDto, HttpServletRequest request) {
//        logger.debug("Registering user account with information: {}", accountDto);
//        User registered = createUserAccount(accountDto);
//        if (registered == null) {
//            throw new UserAlreadyExistException();
//        }
//        String appUrl = "http://" + request.getServerName() + ":" +
//                request.getServerPort() + request.getContextPath();
//
//        eventPublisher.publishEvent(
//                new OnRegistrationCompleteEvent(registered, request.getLocale(), appUrl));
//
//        return new GenericResponse("success");
//    }
}
