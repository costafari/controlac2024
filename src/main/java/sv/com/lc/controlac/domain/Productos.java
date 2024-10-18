package sv.com.lc.controlac.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Productos.
 */
@Entity
@Table(name = "productos")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Productos implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "descipcion")
    private String descipcion;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "notas")
    private String notas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "proveedores", "productos", "facturas" }, allowSetters = true)
    private Lotes lotes;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Productos id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescipcion() {
        return this.descipcion;
    }

    public Productos descipcion(String descipcion) {
        this.setDescipcion(descipcion);
        return this;
    }

    public void setDescipcion(String descipcion) {
        this.descipcion = descipcion;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Productos nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNotas() {
        return this.notas;
    }

    public Productos notas(String notas) {
        this.setNotas(notas);
        return this;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public Lotes getLotes() {
        return this.lotes;
    }

    public void setLotes(Lotes lotes) {
        this.lotes = lotes;
    }

    public Productos lotes(Lotes lotes) {
        this.setLotes(lotes);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Productos)) {
            return false;
        }
        return getId() != null && getId().equals(((Productos) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Productos{" +
            "id=" + getId() +
            ", descipcion='" + getDescipcion() + "'" +
            ", nombre='" + getNombre() + "'" +
            ", notas='" + getNotas() + "'" +
            "}";
    }
}
