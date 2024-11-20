package sv.com.lc.controlac.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static sv.com.lc.controlac.domain.ClientesAsserts.*;
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
import sv.com.lc.controlac.domain.Clientes;
import sv.com.lc.controlac.repository.ClientesRepository;

/**
 * Integration tests for the {@link ClientesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClientesResourceIT {

    private static final Boolean DEFAULT_ACTIVO = false;
    private static final Boolean UPDATED_ACTIVO = true;

    private static final String DEFAULT_APELLIDOS = "AAAAAAAAAA";
    private static final String UPDATED_APELLIDOS = "BBBBBBBBBB";

    private static final String DEFAULT_DIRECION = "AAAAAAAAAA";
    private static final String UPDATED_DIRECION = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE_CONTACTO = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_CONTACTO = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE_EMPRESA = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_EMPRESA = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRES = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRES = "BBBBBBBBBB";

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

    private static final String ENTITY_API_URL = "/api/clientes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ClientesRepository clientesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClientesMockMvc;

    private Clientes clientes;

    private Clientes insertedClientes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Clientes createEntity() {
        return new Clientes()
            .activo(DEFAULT_ACTIVO)
            .apellidos(DEFAULT_APELLIDOS)
            .direcion(DEFAULT_DIRECION)
            .email(DEFAULT_EMAIL)
            .nombreContacto(DEFAULT_NOMBRE_CONTACTO)
            .nombreEmpresa(DEFAULT_NOMBRE_EMPRESA)
            .nombres(DEFAULT_NOMBRES)
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
    public static Clientes createUpdatedEntity() {
        return new Clientes()
            .activo(UPDATED_ACTIVO)
            .apellidos(UPDATED_APELLIDOS)
            .direcion(UPDATED_DIRECION)
            .email(UPDATED_EMAIL)
            .nombreContacto(UPDATED_NOMBRE_CONTACTO)
            .nombreEmpresa(UPDATED_NOMBRE_EMPRESA)
            .nombres(UPDATED_NOMBRES)
            .notas(UPDATED_NOTAS)
            .sitioWeb(UPDATED_SITIO_WEB)
            .telefonoFijo(UPDATED_TELEFONO_FIJO)
            .telefonoFijo2(UPDATED_TELEFONO_FIJO_2)
            .telefonoMovil(UPDATED_TELEFONO_MOVIL)
            .telefonoMovil2(UPDATED_TELEFONO_MOVIL_2);
    }

    @BeforeEach
    public void initTest() {
        clientes = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedClientes != null) {
            clientesRepository.delete(insertedClientes);
            insertedClientes = null;
        }
    }

    @Test
    @Transactional
    void createClientes() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Clientes
        var returnedClientes = om.readValue(
            restClientesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientes)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Clientes.class
        );

        // Validate the Clientes in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertClientesUpdatableFieldsEquals(returnedClientes, getPersistedClientes(returnedClientes));

        insertedClientes = returnedClientes;
    }

    @Test
    @Transactional
    void createClientesWithExistingId() throws Exception {
        // Create the Clientes with an existing ID
        clientes.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClientesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientes)))
            .andExpect(status().isBadRequest());

        // Validate the Clientes in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClientes() throws Exception {
        // Initialize the database
        insertedClientes = clientesRepository.saveAndFlush(clientes);

        // Get all the clientesList
        restClientesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clientes.getId().intValue())))
            .andExpect(jsonPath("$.[*].activo").value(hasItem(DEFAULT_ACTIVO.booleanValue())))
            .andExpect(jsonPath("$.[*].apellidos").value(hasItem(DEFAULT_APELLIDOS)))
            .andExpect(jsonPath("$.[*].direcion").value(hasItem(DEFAULT_DIRECION)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].nombreContacto").value(hasItem(DEFAULT_NOMBRE_CONTACTO)))
            .andExpect(jsonPath("$.[*].nombreEmpresa").value(hasItem(DEFAULT_NOMBRE_EMPRESA)))
            .andExpect(jsonPath("$.[*].nombres").value(hasItem(DEFAULT_NOMBRES)))
            .andExpect(jsonPath("$.[*].notas").value(hasItem(DEFAULT_NOTAS)))
            .andExpect(jsonPath("$.[*].sitioWeb").value(hasItem(DEFAULT_SITIO_WEB)))
            .andExpect(jsonPath("$.[*].telefonoFijo").value(hasItem(DEFAULT_TELEFONO_FIJO)))
            .andExpect(jsonPath("$.[*].telefonoFijo2").value(hasItem(DEFAULT_TELEFONO_FIJO_2)))
            .andExpect(jsonPath("$.[*].telefonoMovil").value(hasItem(DEFAULT_TELEFONO_MOVIL)))
            .andExpect(jsonPath("$.[*].telefonoMovil2").value(hasItem(DEFAULT_TELEFONO_MOVIL_2)));
    }

    @Test
    @Transactional
    void getClientes() throws Exception {
        // Initialize the database
        insertedClientes = clientesRepository.saveAndFlush(clientes);

        // Get the clientes
        restClientesMockMvc
            .perform(get(ENTITY_API_URL_ID, clientes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clientes.getId().intValue()))
            .andExpect(jsonPath("$.activo").value(DEFAULT_ACTIVO.booleanValue()))
            .andExpect(jsonPath("$.apellidos").value(DEFAULT_APELLIDOS))
            .andExpect(jsonPath("$.direcion").value(DEFAULT_DIRECION))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.nombreContacto").value(DEFAULT_NOMBRE_CONTACTO))
            .andExpect(jsonPath("$.nombreEmpresa").value(DEFAULT_NOMBRE_EMPRESA))
            .andExpect(jsonPath("$.nombres").value(DEFAULT_NOMBRES))
            .andExpect(jsonPath("$.notas").value(DEFAULT_NOTAS))
            .andExpect(jsonPath("$.sitioWeb").value(DEFAULT_SITIO_WEB))
            .andExpect(jsonPath("$.telefonoFijo").value(DEFAULT_TELEFONO_FIJO))
            .andExpect(jsonPath("$.telefonoFijo2").value(DEFAULT_TELEFONO_FIJO_2))
            .andExpect(jsonPath("$.telefonoMovil").value(DEFAULT_TELEFONO_MOVIL))
            .andExpect(jsonPath("$.telefonoMovil2").value(DEFAULT_TELEFONO_MOVIL_2));
    }

    @Test
    @Transactional
    void getNonExistingClientes() throws Exception {
        // Get the clientes
        restClientesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClientes() throws Exception {
        // Initialize the database
        insertedClientes = clientesRepository.saveAndFlush(clientes);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clientes
        Clientes updatedClientes = clientesRepository.findById(clientes.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedClientes are not directly saved in db
        em.detach(updatedClientes);
        updatedClientes
            .activo(UPDATED_ACTIVO)
            .apellidos(UPDATED_APELLIDOS)
            .direcion(UPDATED_DIRECION)
            .email(UPDATED_EMAIL)
            .nombreContacto(UPDATED_NOMBRE_CONTACTO)
            .nombreEmpresa(UPDATED_NOMBRE_EMPRESA)
            .nombres(UPDATED_NOMBRES)
            .notas(UPDATED_NOTAS)
            .sitioWeb(UPDATED_SITIO_WEB)
            .telefonoFijo(UPDATED_TELEFONO_FIJO)
            .telefonoFijo2(UPDATED_TELEFONO_FIJO_2)
            .telefonoMovil(UPDATED_TELEFONO_MOVIL)
            .telefonoMovil2(UPDATED_TELEFONO_MOVIL_2);

        restClientesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClientes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedClientes))
            )
            .andExpect(status().isOk());

        // Validate the Clientes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedClientesToMatchAllProperties(updatedClientes);
    }

    @Test
    @Transactional
    void putNonExistingClientes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clientes.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clientes.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clientes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClientes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clientes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(clientes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clientes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClientes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clientes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Clientes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClientesWithPatch() throws Exception {
        // Initialize the database
        insertedClientes = clientesRepository.saveAndFlush(clientes);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clientes using partial update
        Clientes partialUpdatedClientes = new Clientes();
        partialUpdatedClientes.setId(clientes.getId());

        partialUpdatedClientes
            .activo(UPDATED_ACTIVO)
            .email(UPDATED_EMAIL)
            .nombreContacto(UPDATED_NOMBRE_CONTACTO)
            .nombres(UPDATED_NOMBRES)
            .notas(UPDATED_NOTAS)
            .telefonoFijo2(UPDATED_TELEFONO_FIJO_2)
            .telefonoMovil(UPDATED_TELEFONO_MOVIL)
            .telefonoMovil2(UPDATED_TELEFONO_MOVIL_2);

        restClientesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientes.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClientes))
            )
            .andExpect(status().isOk());

        // Validate the Clientes in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClientesUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedClientes, clientes), getPersistedClientes(clientes));
    }

    @Test
    @Transactional
    void fullUpdateClientesWithPatch() throws Exception {
        // Initialize the database
        insertedClientes = clientesRepository.saveAndFlush(clientes);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clientes using partial update
        Clientes partialUpdatedClientes = new Clientes();
        partialUpdatedClientes.setId(clientes.getId());

        partialUpdatedClientes
            .activo(UPDATED_ACTIVO)
            .apellidos(UPDATED_APELLIDOS)
            .direcion(UPDATED_DIRECION)
            .email(UPDATED_EMAIL)
            .nombreContacto(UPDATED_NOMBRE_CONTACTO)
            .nombreEmpresa(UPDATED_NOMBRE_EMPRESA)
            .nombres(UPDATED_NOMBRES)
            .notas(UPDATED_NOTAS)
            .sitioWeb(UPDATED_SITIO_WEB)
            .telefonoFijo(UPDATED_TELEFONO_FIJO)
            .telefonoFijo2(UPDATED_TELEFONO_FIJO_2)
            .telefonoMovil(UPDATED_TELEFONO_MOVIL)
            .telefonoMovil2(UPDATED_TELEFONO_MOVIL_2);

        restClientesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientes.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClientes))
            )
            .andExpect(status().isOk());

        // Validate the Clientes in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClientesUpdatableFieldsEquals(partialUpdatedClientes, getPersistedClientes(partialUpdatedClientes));
    }

    @Test
    @Transactional
    void patchNonExistingClientes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clientes.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clientes.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(clientes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clientes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClientes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clientes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(clientes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clientes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClientes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        clientes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(clientes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Clientes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClientes() throws Exception {
        // Initialize the database
        insertedClientes = clientesRepository.saveAndFlush(clientes);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the clientes
        restClientesMockMvc
            .perform(delete(ENTITY_API_URL_ID, clientes.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return clientesRepository.count();
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

    protected Clientes getPersistedClientes(Clientes clientes) {
        return clientesRepository.findById(clientes.getId()).orElseThrow();
    }

    protected void assertPersistedClientesToMatchAllProperties(Clientes expectedClientes) {
        assertClientesAllPropertiesEquals(expectedClientes, getPersistedClientes(expectedClientes));
    }

    protected void assertPersistedClientesToMatchUpdatableProperties(Clientes expectedClientes) {
        assertClientesAllUpdatablePropertiesEquals(expectedClientes, getPersistedClientes(expectedClientes));
    }
}
