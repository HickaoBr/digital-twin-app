package com.rocket.digital_twin_app.controller;

import com.rocket.digital_twin_app.model.Reading;
import com.rocket.digital_twin_app.model.Sensor;
import com.rocket.digital_twin_app.repository.ReadingRepository;
import com.rocket.digital_twin_app.repository.SensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = "*") // Libera para frontend acessar de outro domínio/IP
public class ReadingController {


    @Autowired
    private ReadingRepository readingRepository;

    @Autowired
    private SensorRepository sensorRepository;

    // GET all readings
    @GetMapping
    public List<Reading> getAllReadings() {
        return readingRepository.findAll();
    }

    // POST a new reading (mocka valor conforme tipo do sensor)
    @PostMapping
    public Reading createReading(@RequestBody Reading reading) {
        String sensorId = reading.getSensorId();
        if (sensorId == null || sensorId.trim().isEmpty()) {
            throw new IllegalArgumentException("SensorId é obrigatório");
        }
        
        Sensor sensor = sensorRepository.findById(sensorId).orElse(null);
        if (sensor != null) {
            String tipo = sensor.getTipo();
            double valorMock;
            if ("pressao".equalsIgnoreCase(tipo)) {
                valorMock = Math.round((Math.random() * 10 + 1) * 100.0) / 100.0;
            } else if ("magnetico".equalsIgnoreCase(tipo) || "indutivo".equalsIgnoreCase(tipo)) {
                valorMock = Math.random() > 0.5 ? 1.0 : 0.0;
            } else {
                valorMock = Math.round((Math.random() * 10 + 1) * 100.0) / 100.0;
            }
            reading.setReadingValue(valorMock);
        } else {
            // Se sensor não existe, ainda assim salva com valor mockado genérico
            reading.setReadingValue(Math.round((Math.random() * 10 + 1) * 100.0) / 100.0);
        }
        
        // Sempre seta timestamp atual no servidor
        reading.setTimestamp(java.time.LocalDateTime.now());
        return readingRepository.save(reading);
    }

    // GET readings by sensor ID (compatível com frontend)
    @GetMapping("/{sensorId}")
    public List<Reading> getReadingsBySensor(@PathVariable String sensorId) {
        return readingRepository.findBySensorId(sensorId);
    }
}
