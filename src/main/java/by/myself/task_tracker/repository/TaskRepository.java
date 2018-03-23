package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.Task;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "tasks", path = "")
public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {
}
