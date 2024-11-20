package sv.com.lc.controlac.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static sv.com.lc.controlac.domain.ProveedoresAsserts.*;
import static sv.com.lc.controlac.web.rest.TestUtil.createUpdateProxyForBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import sv.com.lc.controlac.IntegrationTest;
import sv.com.lc.controlac.domain.Proveedores;
import sv.com.lc.controlac.repository.ProveedoresRepository;

/**
 * Integration tests for the {@link ProveedoresResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProveedoresResourceIT {

    private static final String DEFAULT_DIRECCION = "AAAAAAAAAA";
    private static final String UPDATED_DIRECCION = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE_CONTACTO = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_CONTACTO = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE_EMPRESA = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_EMPRESA = "BBBBBBBBBB";

    private static final String DEFAULT_NOTAS = "AAAAAAAAAA";
    private static final String UPDATED_NOTAS = "BBBBBBBBBB";

    private static final String DEFAULT_SITIO_WEB = "AAAAAAAAAA";
    private static final String UPDATED_SITIO_WEB = "BBBBBBBBBB";

    private static final Integer DEFAULT_TELEFONO_FIJO = 1;
    private static final Integer UPDATED_TELEFONO_FIJO = 2;

    private static final Integer DEFAULT_TELEFONO_FIJO_2 = 1;
    private static final Integer UPDATED_TELEFONO_FIJO_2 = 2;

    private static final Integer DEFAULT_TELEFONO_MOVIL = 1;
    private static final Integer UPDATED_TELEFONO_MOVIL = 2;

    private static final Integer DEFAULT_TELEFONO_MOVIL_2 = 1;
    private static final Integer UPDATED_TELEFONO_MOVIL_2 = 2;

    private static final String ENTITY_API_URL = "/api/proveedores";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ProveedoresRepository proveedoresRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProveedoresMockMvc;

    private Proveedores proveedores;

    private Proveedores insertedProveedores;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proveedores createEntity() {
        return new Proveedores()
            .direccion(DEFAULT_DIRECCION)
            .nombreContacto(DEFAULT_NOMBRE_CONTACTO)
            .nombreEmpresa(DEFAULT_NOMBRE_EMPRESA)
            .notas(DEFAULT_NOTAS)
            .sitioWeb(DEFAULT_SITIO_WEB)
            .telefonoFijo(DEFAULT_TELEFONO_FIJO)
            .telefonoFijo2(DEFAULT_TELEFONO_FIJO_2)
            .telefonoMovil(DEFAULT_TELEFONO_MOVIL)
            .telefonoMovil2(DEFAULT_TELEFONO_MOVIL_2);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proveedores createUpdatedEntity() {
        return new Proveedores()
            .direccion(UPDATED_DIRECCION)
            .nombreContacto(UPDATED_NOMBRE_CONTACTO)
            .nombreEmpresa(UPDATED_NOMBRE_EMPRESA)
            .notas(UPDATED_NOTAS)
            .sitioWeb(UPDATED_SITIO_WEB)
            .telefonoFijo(UPDATED_TELEFONO_FIJO)
            .telefonoFijo2(UPDATED_TELEFONO_FIJO_2)
            .telefonoMovil(UPDATED_TELEFONO_MOVIL)
            .telefonoMovil2(UPDATED_TELEFONO_MOVIL_2);
    }

    @BeforeEach
    public void initTest() {
        proveedores = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedProveedores != null) {
            proveedoresRepository.delete(insertedProveedores);
            insertedProveedores = null;
        }
    }

    @Test
    @Transactional
    void createProveedores() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Proveedores
        var returnedProveedores = om.readValue(
            restProveedoresMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(proveedores)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Proveedores.class
        );

        // Validate the Proveedores in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertProveedoresUpdatableFieldsEquals(returnedProveedores, getPersistedProveedores(returnedProveedores));

        insertedProveedores = returnedProveedores;
    }

    @Test
    @Transactional
    void createProveedoresWithExistingId() throws Exception {
        // Create the Proveedores with an existing ID
        proveedores.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProveedoresMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(proveedores)))
            .andExpect(status().isBadRequest());

        // Validate the Proveedores in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProveedores() throws Exception {
        // Initialize the database
        insertedProveedores = proveedoresRepository.saveAndFlush(proveedores);

        // Get all the proveedoresList
        restProveedoresMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(proveedores.getId().intValue())))
            .andExpect(jsonPath("$.[*].direccion").value(hasItem(DEFAULT_DIRECCION)))
            .andExpect(jsonPath("$.[*].nombreContacto").value(hasItem(DEFAULT_NOMBRE_CONTACTO)))
            .andExpect(jsonPath("$.[*].nombreEmpresa").value(hasItem(DEFAULT_NOMBRE_EMPRESA)))
            .andExpect(jsonPath("$.[*].notas").value(hasItem(DEFAULT_NOTAS)))
            .andExpect(jsonPath("$.[*].sitioWeb").value(hasItem(DEFAULT_SITIO_WEB)))
            .andExpect(jsonPath("$.[*].telefonoFijo").value(hasItem(DEFAULT_TELEFONO_FIJO)))
            .andExpect(jsonPath("$.[*].telefonoFijo2").value(hasItem(DEFAULT_TELEFONO_FIJO_2)))
            .andExpect(jsonPath("$.[*].telefonoMovil").value(hasItem(DEFAULT_TELEFONO_MOVIL)))
            .andExpect(jsonPath("$.[*].telefonoMovil2").value(hasItem(DEFAULT_TELEFONO_MOVIL_2)));
    }

    @Test
    @Transactional
    void getProveedores() throws Exception {
        // Initialize the database
        insertedProveedores = proveedoresRepository.saveAndFlush(proveedores);

        // Get the proveedores
        restProveedoresMockMvc
            .perform(get(ENTITY_API_URL_ID, proveedores.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(proveedores.getId().intValue()))
            .andExpect(jsonPath("$.direccion").value(DEFAULT_DIRECCION))
            .andExpect(jsonPath("$.nombreContacto").value(DEFAULT_NOMBRE_CONTACTO))
            .andExpect(jsonPath("$.nombreEmpresa").value(DEFAULT_NOMBRE_EMPRESA))
            .andExpect(jsonPath("$.notas").value(DEFAULT_NOTAS))
            .andExpect(jsonPath("$.sitioWeb").value(DEFAULT_SITIO_WEB))
            .andExpect(jsonPath("$.telefonoFijo").value(DEFAULT_TELEFONO_FIJO))
            .andExpect(jsonPath("$.telefonoFijo2").value(DEFAULT_TELEFONO_FIJO_2))
            .andExpect(jsonPath("$.telefonoMovil").value(DEFAULT_TELEFONO_MOVIL))
            .andExpect(jsonPath("$.telefonoMovil2").value(DEFAULT_TELEFONO_MOVIL_2));
    }

    @Test
    @Transactional
    void getNonExistingProveedores() throws Exception {
        // Get the proveedores
        restProveedoresMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProveedores() throws Exception {
        // Initialize the database
        insertedProveedores = proveedoresRepository.saveAndFlush(proveedores);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the proveedores
        Proveedores updatedProveedores = proveedoresRepository.findById(proveedores.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedProveedores are not directly saved in db
        em.detach(updatedProveedores);
        updatedProveedores
            .direccion(UPDATED_DIRECCION)
            .nombreContacto(UPDATED_NOMBRE_CONTACTO)
            .nombreEmpresa(UPDATED_NOMBRE_EMPRESA)
            .notas(UPDATED_NOTAS)
            .sitioWeb(UPDATED_SITIO_WEB)
            .telefonoFijo(UPDATED_TELEFONO_FIJO)
            .telefonoFijo2(UPDATED_TELEFONO_FIJO_2)
            .telefonoMovil(UPDATED_TELEFONO_MOVIL)
            .telefonoMovil2(UPDATED_TELEFONO_MOVIL_2);

        restProveedoresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProveedores.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedProveedores))
            )
            .andExpect(status().isOk());

        // Validate the Proveedores in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedProveedoresToMatchAllProperties(updatedProveedores);
    }

    @Test
    @Transactional
    void putNonExistingProveedores() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        proveedores.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProveedoresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, proveedores.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(proveedores))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proveedores in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProveedores() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        proveedores.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProveedoresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(proveedores))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proveedores in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProveedores() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        proveedores.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProveedoresMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(proveedores)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proveedores in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProveedoresWithPatch() throws Exception {
        // Initialize the database
        insertedProveedores = proveedoresRepository.saveAndFlush(proveedores);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the proveedores using partial update
        Proveedores partialUpdatedProveedores = new Proveedores();
        partialUpdatedProveedores.setId(proveedores.getId());

        partialUpdatedProveedores
            .direccion(UPDATED_DIRECCION)
            .nombreEmpresa(UPDATED_NOMBRE_EMPRESA)
            .notas(UPDATED_NOTAS)
            .telefonoMovil2(UPDATED_TELEFONO_MOVIL_2);

        restProveedoresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProveedores.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProveedores))
            )
            .andExpect(status().isOk());

        // Validate the Proveedores in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProveedoresUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedProveedores, proveedores),
            getPersistedProveedores(proveedores)
        );
    }

    @Test
    @Transactional
    void fullUpdateProveedoresWithPatch() throws Exception {
        // Initialize the database
        insertedProveedores = proveedoresRepository.saveAndFlush(proveedores);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the proveedores using partial update
        Proveedores partialUpdatedProveedores = new Proveedores();
        partialUpdatedProveedores.setId(proveedores.getId());

        partialUpdatedProveedores
            .direccion(UPDATED_DIRECCION)
            .nombreContacto(UPDATED_NOMBRE_CONTACTO)
            .nombreEmpresa(UPDATED_NOMBRE_EMPRESA)
            .notas(UPDATED_NOTAS)
            .sitioWeb(UPDATED_SITIO_WEB)
            .telefonoFijo(UPDATED_TELEFONO_FIJO)
            .telefonoFijo2(UPDATED_TELEFONO_FIJO_2)
            .telefonoMovil(UPDATED_TELEFONO_MOVIL)
            .telefonoMovil2(UPDATED_TELEFONO_MOVIL_2);

        restProveedoresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProveedores.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedProveedores))
            )
            .andExpect(status().isOk());

        // Validate the Proveedores in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertProveedoresUpdatableFieldsEquals(partialUpdatedProveedores, getPersistedProveedores(partialUpdatedProveedores));
    }

    @Test
    @Transactional
    void patchNonExistingProveedores() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        proveedores.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProveedoresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, proveedores.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(proveedores))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proveedores in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProveedores() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        proveedores.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProveedoresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(proveedores))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proveedores in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProveedores() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        proveedores.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProveedoresMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(proveedores)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proveedores in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProveedores() throws Exception {
        // Initialize the database
        insertedProveedores = proveedoresRepository.saveAndFlush(proveedores);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the proveedores
        restProveedoresMockMvc
            .perform(delete(ENTITY_API_URL_ID, proveedores.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return proveedoresRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Proveedores getPersistedProveedores(Proveedores proveedores) {
        return proveedoresRepository.findById(proveedores.getId()).orElseThrow();
    }

    protected void assertPersistedProveedoresToMatchAllProperties(Proveedores expectedProveedores) {
        assertProveedoresAllPropertiesEquals(expectedProveedores, getPersistedProveedores(expectedProveedores));
    }

    protected void assertPersistedProveedoresToMatchUpdatableProperties(Proveedores expectedProveedores) {
        assertProveedoresAllUpdatablePropertiesEquals(expectedProveedores, getPersistedProveedores(expectedProveedores));
    }
}
