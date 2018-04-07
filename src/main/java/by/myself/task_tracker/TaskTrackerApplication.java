package by.myself.task_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

// TODO Cache
// TODO For the sake of rightness make dto entities in order to not get all base
@SpringBootApplication
@EnableJpaAuditing
public class TaskTrackerApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(TaskTrackerApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(TaskTrackerApplication.class, args);
	}
}
