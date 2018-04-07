package by.myself.task_tracker.entity.model;

import lombok.*;

/**
 * @author Nazar Kuksov
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {

    private String email;
    private String password;
    private String firstName;
    private String lastName;
}