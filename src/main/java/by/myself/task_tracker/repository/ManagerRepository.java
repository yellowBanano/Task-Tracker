package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.Manager;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * @author Nazar Kuksov
 */
@RepositoryRestResource(collectionResourceRel = "managers", path = "managers")
public interface ManagerRepository extends CrudRepository<Manager, Long> {

    Manager findFirstById(Long id);
}
