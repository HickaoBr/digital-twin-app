package com.rocket.digital_twin_app.config;

import com.rocket.digital_twin_app.model.Sensor;
import com.rocket.digital_twin_app.model.Reading;
import com.rocket.digital_twin_app.repository.SensorRepository;
import com.rocket.digital_twin_app.repository.ReadingRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class DataInitializer {


    private final SensorRepository sensorRepository;
    private final ReadingRepository readingRepository;

    public DataInitializer(SensorRepository sensorRepository, ReadingRepository readingRepository) {
        this.sensorRepository = sensorRepository;
        this.readingRepository = readingRepository;
    }

    @PostConstruct
    public void init() {
        if (sensorRepository.count() == 0) {
            sensorRepository.save(new Sensor("1", "Sensor de Pressão", "pressao"));
            sensorRepository.save(new Sensor("2", "Sensor Magnético", "magnetico"));
            sensorRepository.save(new Sensor("3", "Sensor Indutivo", "indutivo"));
            sensorRepository.save(new Sensor("123", "Sensor de Teste", "pressao"));
        }
        // Gera uma leitura mockada inicial para cada sensor, se não houver nenhuma leitura
        if (readingRepository.count() == 0) {
            List<Sensor> sensores = sensorRepository.findAll();
            LocalDateTime now = LocalDateTime.now();
            for (Sensor sensor : sensores) {
                double valorMock;
                String tipo = sensor.getTipo();
                if ("pressao".equalsIgnoreCase(tipo)) {
                    valorMock = Math.round((Math.random() * 10 + 1) * 100.0) / 100.0;
                } else if ("magnetico".equalsIgnoreCase(tipo) || "indutivo".equalsIgnoreCase(tipo)) {
                    valorMock = Math.random() > 0.5 ? 1.0 : 0.0;
                } else {
                    valorMock = Math.round((Math.random() * 10 + 1) * 100.0) / 100.0;
                }
                Reading r = new Reading();
                r.setSensorId(sensor.getId());
                r.setReadingValue(valorMock);
                r.setTimestamp(now);
                readingRepository.save(r);
            }
        }
    }
}
