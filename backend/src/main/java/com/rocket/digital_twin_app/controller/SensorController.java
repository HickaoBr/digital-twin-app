package com.rocket.digital_twin_app.controller;

import com.rocket.digital_twin_app.model.Sensor;
import com.rocket.digital_twin_app.repository.SensorRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    private final SensorRepository repository;

    public SensorController(SensorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Sensor> listarSensores() {
        return repository.findAll();
    }


}
