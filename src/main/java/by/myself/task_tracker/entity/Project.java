package by.myself.task_tracker.entity;

import lombok.*;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true, exclude = {"developers"})
public class Project extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "id_manager")
    private Manager manager;

    @ManyToMany(mappedBy = "projects")
    private Set<Developer> developers = new HashSet<>();

    @OneToMany(mappedBy = "project")
    private Set<Task> tasks = new HashSet<>();

    @Column(name = "title", unique = true)
    private String title;
}
