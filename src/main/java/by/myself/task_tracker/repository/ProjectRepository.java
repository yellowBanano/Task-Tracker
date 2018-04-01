package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.Project;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "projects", path = "projects")
public interface ProjectRepository extends CrudRepository<Project, Long> {
}
