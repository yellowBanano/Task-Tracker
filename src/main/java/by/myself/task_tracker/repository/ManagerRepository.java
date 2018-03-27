package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.Manager;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * @author Nazar Kuksov
 */
@RepositoryRestResource(collectionResourceRel = "managers", path = "managers")
public interface ManagerRepository extends PagingAndSortingRepository<Manager, Long> {

    Manager findFirstById(Long id);
}
