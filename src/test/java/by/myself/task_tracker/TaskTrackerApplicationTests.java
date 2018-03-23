package by.myself.task_tracker;

import by.myself.task_tracker.repository.CommentRepository;
import by.myself.task_tracker.repository.DeveloperRepository;
import by.myself.task_tracker.repository.ManagerRepository;
import by.myself.task_tracker.repository.ProjectRepository;
import by.myself.task_tracker.repository.TaskRepository;
import by.myself.task_tracker.repository.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TaskTrackerApplicationTests {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private CommentRepository commentRepository;
	@Autowired
	private DeveloperRepository developerRepository;
	@Autowired
	private ManagerRepository managerRepository;
	@Autowired
	private ProjectRepository projectRepository;
	@Autowired
	private TaskRepository taskRepository;

	@Test
	public void contextLoads() {
		userRepository.findAll().forEach(System.out::println);
		commentRepository.findAll().forEach(System.out::println);
		projectRepository.findAll().forEach(System.out::println);
		taskRepository.findAll().forEach(System.out::println);
		developerRepository.findAll().forEach(System.out::println);
		managerRepository.findAll().forEach(System.out::println);
	}

}
