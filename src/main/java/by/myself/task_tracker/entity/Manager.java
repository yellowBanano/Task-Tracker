package by.myself.task_tracker.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import java.util.List;

@Entity
@Table(name = "managers")
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true, exclude = {"myProjects"})
@PrimaryKeyJoinColumn(name = "id_user")
public class Manager extends User {

    @OneToMany(mappedBy = "manager")
    private List<Project> myProjects;

    public Manager(String email, String password, String firstName, String lastName, Role role, boolean enabled) {
        super(email, password, firstName, lastName, role, enabled);
    }

    public Manager(User user) {
        super(user.getEmail(), user.getPassword(), user.getFirstName(), user.getLastName(), user.getRole(), user.isEnabled());
    }
}
