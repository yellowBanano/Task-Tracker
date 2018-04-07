package by.myself.task_tracker.security;

import by.myself.task_tracker.entity.Role;
import by.myself.task_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class SpringDataJpaUserDetailsService implements UserDetailsService {

	private final UserRepository repository;

	@Autowired
	public SpringDataJpaUserDetailsService(UserRepository repository) {
		this.repository = repository;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
 		by.myself.task_tracker.entity.User user = this.repository.findByEmail(email);
		if (user == null) {
			throw new UsernameNotFoundException("User doesn't exist!");
		}
		HashSet<Role> roles = new HashSet<>();
		roles.add(user.getRole());
		return new User(user.getEmail(), user.getPassword(), generateAuthorities(roles));
	}

	private Collection<? extends GrantedAuthority> generateAuthorities(Set<Role> roles) {
		return roles
				.stream()
				.map(role -> new SimpleGrantedAuthority(role.toString()))
				.collect(Collectors.toList());
	}

}
