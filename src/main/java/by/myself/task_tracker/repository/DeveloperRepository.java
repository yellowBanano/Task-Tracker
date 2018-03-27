package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.Developer;
import by.myself.task_tracker.entity.Project;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Set;

/**
 * @author Nazar Kuksov
 */
@RepositoryRestResource(collectionResourceRel = "developers", path = "developers")
public interface DeveloperRepository extends PagingAndSortingRepository<Developer, Long> {

    Developer findFirstById(Long id);
}
