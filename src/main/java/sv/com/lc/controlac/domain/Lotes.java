package sv.com.lc.controlac.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Lotes.
 */
@Entity
@Table(name = "lotes")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Lotes implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "fecha_entrada")
    private LocalDate fechaEntrada;

    @Column(name = "lote")
    private String lote;

    @JsonIgnoreProperties(value = { "lotes" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private Proveedores proveedores;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "lotes")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lotes" }, allowSetters = true)
    private Set<Productos> productos = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "lotes")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "clientes", "lotes", "detalles", "abonos" }, allowSetters = true)
    private Set<Facturas> facturas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Lotes id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCantidad() {
        return this.cantidad;
    }

    public Lotes cantidad(Integer cantidad) {
        this.setCantidad(cantidad);
        return this;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public LocalDate getFechaEntrada() {
        return this.fechaEntrada;
    }

    public Lotes fechaEntrada(LocalDate fechaEntrada) {
        this.setFechaEntrada(fechaEntrada);
        return this;
    }

    public void setFechaEntrada(LocalDate fechaEntrada) {
        this.fechaEntrada = fechaEntrada;
    }

    public String getLote() {
        return this.lote;
    }

    public Lotes lote(String lote) {
        this.setLote(lote);
        return this;
    }

    public void setLote(String lote) {
        this.lote = lote;
    }

    public Proveedores getProveedores() {
        return this.proveedores;
    }

    public void setProveedores(Proveedores proveedores) {
        this.proveedores = proveedores;
    }

    public Lotes proveedores(Proveedores proveedores) {
        this.setProveedores(proveedores);
        return this;
    }

    public Set<Productos> getProductos() {
        return this.productos;
    }

    public void setProductos(Set<Productos> productos) {
        if (this.productos != null) {
            this.productos.forEach(i -> i.setLotes(null));
        }
        if (productos != null) {
            productos.forEach(i -> i.setLotes(this));
        }
        this.productos = productos;
    }

    public Lotes productos(Set<Productos> productos) {
        this.setProductos(productos);
        return this;
    }

    public Lotes addProductos(Productos productos) {
        this.productos.add(productos);
        productos.setLotes(this);
        return this;
    }

    public Lotes removeProductos(Productos productos) {
        this.productos.remove(productos);
        productos.setLotes(null);
        return this;
    }

    public Set<Facturas> getFacturas() {
        return this.facturas;
    }

    public void setFacturas(Set<Facturas> facturas) {
        if (this.facturas != null) {
            this.facturas.forEach(i -> i.setLotes(null));
        }
        if (facturas != null) {
            facturas.forEach(i -> i.setLotes(this));
        }
        this.facturas = facturas;
    }

    public Lotes facturas(Set<Facturas> facturas) {
        this.setFacturas(facturas);
        return this;
    }

    public Lotes addFacturas(Facturas facturas) {
        this.facturas.add(facturas);
        facturas.setLotes(this);
        return this;
    }

    public Lotes removeFacturas(Facturas facturas) {
        this.facturas.remove(facturas);
        facturas.setLotes(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lotes)) {
            return false;
        }
        return getId() != null && getId().equals(((Lotes) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Lotes{" +
            "id=" + getId() +
            ", cantidad=" + getCantidad() +
            ", fechaEntrada='" + getFechaEntrada() + "'" +
            ", lote='" + getLote() + "'" +
            "}";
    }
}
