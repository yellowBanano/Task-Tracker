package by.myself.task_tracker.repository;

import by.myself.task_tracker.entity.User;
import by.myself.task_tracker.entity.VerificationToken;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Date;
import java.util.stream.Stream;

/**
 * @author Nazar Kuksov
 */
@RepositoryRestResource(collectionResourceRel = "tokens", path = "tokens")
public interface VerificationTokenRepository extends CrudRepository<VerificationToken, Long> {

    VerificationToken findByToken(String token);

    VerificationToken findByUser(User user);

    Stream<VerificationToken> findAllByExpireDateLessThan(Date now);

    void deleteByExpireDateLessThan(Date now);

    @Modifying
    @Query("delete from VerificationToken t where t.expireDate <= ?1")
    void deleteAllExpiredSince(Date now);
}
