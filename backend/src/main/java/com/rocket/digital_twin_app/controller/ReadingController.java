package com.rocket.digital_twin_app.controller;

import com.rocket.digital_twin_app.model.Reading;
import com.rocket.digital_twin_app.repository.ReadingRepository;
import com.rocket.digital_twin_app.repository.SensorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = "*")
public class ReadingController {

    private static final Logger logger = LoggerFactory.getLogger(ReadingController.class);

    @Autowired
    private ReadingRepository readingRepository;

    @Autowired
    private SensorRepository sensorRepository;

    // GET all readings
    @GetMapping
    public List<Reading> getAllReadings() {
        return readingRepository.findAll();
    }

    @PostMapping
    public Reading createReading(@RequestBody Reading reading) {
        logger.debug("Recebendo leitura: sensorId={}, value={}", 
                    reading.getSensorId(), reading.getReadingValue());
        
        String sensorId = reading.getSensorId();
        if (sensorId == null || sensorId.trim().isEmpty()) {
            throw new IllegalArgumentException("SensorId é obrigatório");
        }
        
        sensorRepository.findById(sensorId).ifPresentOrElse(
            sensor -> {
                String tipo = sensor.getTipo();
                double valorMock;
                String status = "OK";
                
                if ("pressao".equalsIgnoreCase(tipo)) {
                    valorMock = Double.parseDouble(String.format(Locale.US, "%.2f", Math.random() * 10 + 1));
                    if (valorMock > 9) {
                        status = "Alerta";
                    }
                } else if ("magnetico".equalsIgnoreCase(tipo) || "indutivo".equalsIgnoreCase(tipo)) {
                    valorMock = Math.random() > 0.5 ? 1.0 : 0.0;
                    if (valorMock == 0.0) {
                        status = "Alerta";
                    }
                } else {
                    valorMock = Double.parseDouble(String.format(Locale.US, "%.2f", Math.random() * 10 + 1));
                }
                
                reading.setReadingValue(valorMock);
                reading.setStatus(status);
                logger.debug("Sensor encontrado: tipo={}, valorMock={}, status={}", 
                            tipo, valorMock, status);
            },
            () -> {
                double valorGenerico = Double.parseDouble(String.format(Locale.US, "%.2f", Math.random() * 10 + 1));
                reading.setReadingValue(valorGenerico);
                reading.setStatus("OK");
                logger.warn("Sensor não encontrado: {}, usando valor genérico", sensorId);
            }
        );
        
        reading.setTimestamp(java.time.LocalDateTime.now());
        Reading saved = readingRepository.save(reading);
        logger.info("Leitura salva: id={}, sensorId={}, value={}, status={}", 
                   saved.getId(), saved.getSensorId(), saved.getReadingValue(), saved.getStatus());
        return saved;
    }

    @GetMapping("/{sensorId}")
    public List<Reading> getReadingsBySensor(@PathVariable String sensorId) {
        logger.debug("Buscando leituras do sensor: {}", sensorId);
        List<Reading> readings = readingRepository.findBySensorId(sensorId);
        logger.debug("Encontradas {} leituras para sensor {}", readings.size(), sensorId);
        return readings;
    }
}
