package sv.com.lc.controlac.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sv.com.lc.controlac.domain.Proveedores;
import sv.com.lc.controlac.repository.ProveedoresRepository;
import sv.com.lc.controlac.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sv.com.lc.controlac.domain.Proveedores}.
 */
@RestController
@RequestMapping("/api/proveedores")
@Transactional
public class ProveedoresResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProveedoresResource.class);

    private static final String ENTITY_NAME = "proveedores";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProveedoresRepository proveedoresRepository;

    public ProveedoresResource(ProveedoresRepository proveedoresRepository) {
        this.proveedoresRepository = proveedoresRepository;
    }

    /**
     * {@code POST  /proveedores} : Create a new proveedores.
     *
     * @param proveedores the proveedores to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new proveedores, or with status {@code 400 (Bad Request)} if the proveedores has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Proveedores> createProveedores(@RequestBody Proveedores proveedores) throws URISyntaxException {
        LOG.debug("REST request to save Proveedores : {}", proveedores);
        if (proveedores.getId() != null) {
            throw new BadRequestAlertException("A new proveedores cannot already have an ID", ENTITY_NAME, "idexists");
        }
        proveedores = proveedoresRepository.save(proveedores);
        return ResponseEntity.created(new URI("/api/proveedores/" + proveedores.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, proveedores.getId().toString()))
            .body(proveedores);
    }

    /**
     * {@code PUT  /proveedores/:id} : Updates an existing proveedores.
     *
     * @param id the id of the proveedores to save.
     * @param proveedores the proveedores to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated proveedores,
     * or with status {@code 400 (Bad Request)} if the proveedores is not valid,
     * or with status {@code 500 (Internal Server Error)} if the proveedores couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Proveedores> updateProveedores(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Proveedores proveedores
    ) throws URISyntaxException {
        LOG.debug("REST request to update Proveedores : {}, {}", id, proveedores);
        if (proveedores.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, proveedores.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!proveedoresRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        proveedores = proveedoresRepository.save(proveedores);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, proveedores.getId().toString()))
            .body(proveedores);
    }

    /**
     * {@code PATCH  /proveedores/:id} : Partial updates given fields of an existing proveedores, field will ignore if it is null
     *
     * @param id the id of the proveedores to save.
     * @param proveedores the proveedores to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated proveedores,
     * or with status {@code 400 (Bad Request)} if the proveedores is not valid,
     * or with status {@code 404 (Not Found)} if the proveedores is not found,
     * or with status {@code 500 (Internal Server Error)} if the proveedores couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Proveedores> partialUpdateProveedores(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Proveedores proveedores
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Proveedores partially : {}, {}", id, proveedores);
        if (proveedores.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, proveedores.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!proveedoresRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Proveedores> result = proveedoresRepository
            .findById(proveedores.getId())
            .map(existingProveedores -> {
                if (proveedores.getDireccion() != null) {
                    existingProveedores.setDireccion(proveedores.getDireccion());
                }
                if (proveedores.getNombreContacto() != null) {
                    existingProveedores.setNombreContacto(proveedores.getNombreContacto());
                }
                if (proveedores.getNombreEmpresa() != null) {
                    existingProveedores.setNombreEmpresa(proveedores.getNombreEmpresa());
                }
                if (proveedores.getNotas() != null) {
                    existingProveedores.setNotas(proveedores.getNotas());
                }
                if (proveedores.getSitioWeb() != null) {
                    existingProveedores.setSitioWeb(proveedores.getSitioWeb());
                }
                if (proveedores.getTelefonoFijo() != null) {
                    existingProveedores.setTelefonoFijo(proveedores.getTelefonoFijo());
                }
                if (proveedores.getTelefonoFijo2() != null) {
                    existingProveedores.setTelefonoFijo2(proveedores.getTelefonoFijo2());
                }
                if (proveedores.getTelefonoMovil() != null) {
                    existingProveedores.setTelefonoMovil(proveedores.getTelefonoMovil());
                }
                if (proveedores.getTelefonoMovil2() != null) {
                    existingProveedores.setTelefonoMovil2(proveedores.getTelefonoMovil2());
                }

                return existingProveedores;
            })
            .map(proveedoresRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, proveedores.getId().toString())
        );
    }

    /**
     * {@code GET  /proveedores} : get all the proveedores.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of proveedores in body.
     */
    @GetMapping("")
    public List<Proveedores> getAllProveedores(@RequestParam(name = "filter", required = false) String filter) {
        if ("lotes-is-null".equals(filter)) {
            LOG.debug("REST request to get all Proveedoress where lotes is null");
            return StreamSupport.stream(proveedoresRepository.findAll().spliterator(), false)
                .filter(proveedores -> proveedores.getLotes() == null)
                .toList();
        }
        LOG.debug("REST request to get all Proveedores");
        return proveedoresRepository.findAll();
    }

    /**
     * {@code GET  /proveedores/:id} : get the "id" proveedores.
     *
     * @param id the id of the proveedores to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the proveedores, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Proveedores> getProveedores(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Proveedores : {}", id);
        Optional<Proveedores> proveedores = proveedoresRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(proveedores);
    }

    /**
     * {@code DELETE  /proveedores/:id} : delete the "id" proveedores.
     *
     * @param id the id of the proveedores to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProveedores(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Proveedores : {}", id);
        proveedoresRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
