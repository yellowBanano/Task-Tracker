package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.Developer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * @author Nazar Kuksov
 */
@RepositoryRestResource(collectionResourceRel = "developers", path = "developers")
public interface DeveloperRepository extends CrudRepository<Developer, Long> {

    Developer findFirstById(Long id);
}
