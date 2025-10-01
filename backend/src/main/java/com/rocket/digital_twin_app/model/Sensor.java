package com.rocket.digital_twin_app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Sensor {

    @Id
    private String id;

    private String nome;
    private String tipo;

    public Sensor() {}

    public Sensor(String id, String nome, String tipo) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}
