package com.rocket.digital_twin_app.config;

import com.rocket.digital_twin_app.model.Sensor;
import com.rocket.digital_twin_app.model.Reading;
import com.rocket.digital_twin_app.model.User;
import com.rocket.digital_twin_app.repository.SensorRepository;
import com.rocket.digital_twin_app.repository.ReadingRepository;
import com.rocket.digital_twin_app.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Component
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final SensorRepository sensorRepository;
    private final ReadingRepository readingRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(SensorRepository sensorRepository, 
                          ReadingRepository readingRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.sensorRepository = sensorRepository;
        this.readingRepository = readingRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        if (userRepository.count() == 0) {
            User adminUser = new User(
                "admin",
                passwordEncoder.encode("admin123"),
                "ROLE_USER"
            );
            userRepository.save(adminUser);
            logger.info("Usuário padrão criado: admin");
        }

        if (sensorRepository.count() == 0) {
            sensorRepository.save(new Sensor("1", "Sensor de Pressão", "pressao"));
            sensorRepository.save(new Sensor("2", "Sensor Magnético", "magnetico"));
            sensorRepository.save(new Sensor("3", "Sensor Indutivo", "indutivo"));
            sensorRepository.save(new Sensor("123", "Sensor de Teste", "pressao"));
            logger.info("Sensores padrão criados: 4 sensores");
        }
        // Gera uma leitura mockada inicial para cada sensor, se não houver nenhuma leitura
        if (readingRepository.count() == 0) {
            List<Sensor> sensores = sensorRepository.findAll();
            LocalDateTime now = LocalDateTime.now();
            for (Sensor sensor : sensores) {
                double valorMock;
                String status = "OK";
                String tipo = sensor.getTipo();
                
                if ("pressao".equalsIgnoreCase(tipo)) {
                    // Gera número entre 1.00 e ~10.99 com duas casas decimais
                    valorMock = Double.parseDouble(String.format(Locale.US, "%.2f", Math.random() * 10 + 1));
                    // Status "Alerta" se valor > 9
                    if (valorMock > 9) {
                        status = "Alerta";
                    }
                } else if ("magnetico".equalsIgnoreCase(tipo) || "indutivo".equalsIgnoreCase(tipo)) {
                    // Gera 1.0 (ativo) ou 0.0 (inativo) com 50% de chance
                    valorMock = Math.random() > 0.5 ? 1.0 : 0.0;
                    // Status "Alerta" se inativo (0.0)
                    if (valorMock == 0.0) {
                        status = "Alerta";
                    }
                } else {
                    // Tipo desconhecido - usa padrão de pressão
                    valorMock = Double.parseDouble(String.format(Locale.US, "%.2f", Math.random() * 10 + 1));
                }
                
                Reading r = new Reading();
                r.setSensorId(sensor.getId());
                r.setReadingValue(valorMock);
                r.setStatus(status);
                r.setTimestamp(now);
                readingRepository.save(r);
            }
        }
    }
}
