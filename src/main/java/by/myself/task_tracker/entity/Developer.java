package by.myself.task_tracker.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "developers")
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true, exclude = {"projects", "tasks"})
@PrimaryKeyJoinColumn(name = "id_user")
public class Developer extends User {

    @ManyToMany
    @JoinTable(
            name = "project_developer",
            joinColumns = @JoinColumn(name = "id_developer"),
            inverseJoinColumns = @JoinColumn(name = "id_project")
    )
    private Set<Project> projects = new HashSet<>();

    @OneToMany(mappedBy = "developer")
    private Set<Task> tasks = new HashSet<>();

    public Developer(User user) {
        super(user.getEmail(), user.getPassword(), user.getFirstName(), user.getLastName(), user.getRole(), user.isEnabled());
    }
}
