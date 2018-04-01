package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.Comment;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "comments", path = "comments")
public interface CommentRepository extends CrudRepository<Comment, Long> {
}