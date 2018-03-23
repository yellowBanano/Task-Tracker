package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.Project;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "projects", path = "")
public interface ProjectRepository extends PagingAndSortingRepository<Project, Long> {
}
