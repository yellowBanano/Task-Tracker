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
@AllArgsConstructor
@ToString(callSuper = true, exclude = {"myProjects"})
@PrimaryKeyJoinColumn(name = "id_user")
public class Manager extends User {

    @OneToMany(mappedBy = "manager")
    private List<Project> myProjects;

}
