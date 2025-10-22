package com.rocket.digital_twin_app.repository;

import com.rocket.digital_twin_app.model.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorRepository extends JpaRepository<Sensor, String> {
}
