package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.Developer;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * @author Nazar Kuksov
 */
@RepositoryRestResource(collectionResourceRel = "developers")
public interface DeveloperRepository extends PagingAndSortingRepository<Developer, Long> {

    Developer findFirstById(Long id);
}
