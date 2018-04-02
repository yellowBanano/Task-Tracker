package by.myself.task_tracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = true, exclude = {"user"})
@EntityListeners(AuditingEntityListener.class)
public class Comment extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "id_task")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @Column(name = "text")
    @NotBlank
    private String text;

    @Version
    @JsonIgnore
    private Long version;

    @Column(name = "post_time")
    @CreatedDate
    private LocalDateTime postTime;
}
