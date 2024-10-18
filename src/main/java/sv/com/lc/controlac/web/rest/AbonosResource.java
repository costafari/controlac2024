package sv.com.lc.controlac.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sv.com.lc.controlac.domain.Abonos;
import sv.com.lc.controlac.repository.AbonosRepository;
import sv.com.lc.controlac.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sv.com.lc.controlac.domain.Abonos}.
 */
@RestController
@RequestMapping("/api/abonos")
@Transactional
public class AbonosResource {

    private static final Logger LOG = LoggerFactory.getLogger(AbonosResource.class);

    private static final String ENTITY_NAME = "abonos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AbonosRepository abonosRepository;

    public AbonosResource(AbonosRepository abonosRepository) {
        this.abonosRepository = abonosRepository;
    }

    /**
     * {@code POST  /abonos} : Create a new abonos.
     *
     * @param abonos the abonos to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abonos, or with status {@code 400 (Bad Request)} if the abonos has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Abonos> createAbonos(@Valid @RequestBody Abonos abonos) throws URISyntaxException {
        LOG.debug("REST request to save Abonos : {}", abonos);
        if (abonos.getId() != null) {
            throw new BadRequestAlertException("A new abonos cannot already have an ID", ENTITY_NAME, "idexists");
        }
        abonos = abonosRepository.save(abonos);
        return ResponseEntity.created(new URI("/api/abonos/" + abonos.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, abonos.getId().toString()))
            .body(abonos);
    }

    /**
     * {@code PUT  /abonos/:id} : Updates an existing abonos.
     *
     * @param id the id of the abonos to save.
     * @param abonos the abonos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abonos,
     * or with status {@code 400 (Bad Request)} if the abonos is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abonos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Abonos> updateAbonos(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Abonos abonos
    ) throws URISyntaxException {
        LOG.debug("REST request to update Abonos : {}, {}", id, abonos);
        if (abonos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abonos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abonosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        abonos = abonosRepository.save(abonos);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, abonos.getId().toString()))
            .body(abonos);
    }

    /**
     * {@code PATCH  /abonos/:id} : Partial updates given fields of an existing abonos, field will ignore if it is null
     *
     * @param id the id of the abonos to save.
     * @param abonos the abonos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abonos,
     * or with status {@code 400 (Bad Request)} if the abonos is not valid,
     * or with status {@code 404 (Not Found)} if the abonos is not found,
     * or with status {@code 500 (Internal Server Error)} if the abonos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abonos> partialUpdateAbonos(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abonos abonos
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Abonos partially : {}, {}", id, abonos);
        if (abonos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abonos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abonosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abonos> result = abonosRepository
            .findById(abonos.getId())
            .map(existingAbonos -> {
                if (abonos.getSaldoAnterior() != null) {
                    existingAbonos.setSaldoAnterior(abonos.getSaldoAnterior());
                }
                if (abonos.getAbono() != null) {
                    existingAbonos.setAbono(abonos.getAbono());
                }
                if (abonos.getNuevoSaldo() != null) {
                    existingAbonos.setNuevoSaldo(abonos.getNuevoSaldo());
                }

                return existingAbonos;
            })
            .map(abonosRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, abonos.getId().toString())
        );
    }

    /**
     * {@code GET  /abonos} : get all the abonos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abonos in body.
     */
    @GetMapping("")
    public List<Abonos> getAllAbonos() {
        LOG.debug("REST request to get all Abonos");
        return abonosRepository.findAll();
    }

    /**
     * {@code GET  /abonos/:id} : get the "id" abonos.
     *
     * @param id the id of the abonos to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abonos, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Abonos> getAbonos(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Abonos : {}", id);
        Optional<Abonos> abonos = abonosRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(abonos);
    }

    /**
     * {@code DELETE  /abonos/:id} : delete the "id" abonos.
     *
     * @param id the id of the abonos to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAbonos(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Abonos : {}", id);
        abonosRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
