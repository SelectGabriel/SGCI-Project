package br.tads.ufpr.sgci_backend;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(scanBasePackages = "br.tads.ufpr.sgci_backend")
public class SgciBackendApplication {

	public static void main(String[] args) {
		ApplicationContext appContext = SpringApplication.run(SgciBackendApplication.class, args);
	}

	@Bean
	public ModelMapper modelMapper(){
		return new ModelMapper();
	}

}
