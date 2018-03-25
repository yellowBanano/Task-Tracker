package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.User;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "users")
public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    User findUserByEmail(String email);
}
