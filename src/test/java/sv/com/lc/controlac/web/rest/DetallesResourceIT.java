package sv.com.lc.controlac.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static sv.com.lc.controlac.domain.DetallesAsserts.*;
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
import sv.com.lc.controlac.domain.Detalles;
import sv.com.lc.controlac.repository.DetallesRepository;

/**
 * Integration tests for the {@link DetallesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DetallesResourceIT {

    private static final Long DEFAULT_CANTIDAD = 1L;
    private static final Long UPDATED_CANTIDAD = 2L;

    private static final Long DEFAULT_TOTAL = 1L;
    private static final Long UPDATED_TOTAL = 2L;

    private static final String ENTITY_API_URL = "/api/detalles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DetallesRepository detallesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDetallesMockMvc;

    private Detalles detalles;

    private Detalles insertedDetalles;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Detalles createEntity() {
        return new Detalles().cantidad(DEFAULT_CANTIDAD).total(DEFAULT_TOTAL);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Detalles createUpdatedEntity() {
        return new Detalles().cantidad(UPDATED_CANTIDAD).total(UPDATED_TOTAL);
    }

    @BeforeEach
    public void initTest() {
        detalles = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedDetalles != null) {
            detallesRepository.delete(insertedDetalles);
            insertedDetalles = null;
        }
    }

    @Test
    @Transactional
    void createDetalles() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Detalles
        var returnedDetalles = om.readValue(
            restDetallesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detalles)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Detalles.class
        );

        // Validate the Detalles in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDetallesUpdatableFieldsEquals(returnedDetalles, getPersistedDetalles(returnedDetalles));

        insertedDetalles = returnedDetalles;
    }

    @Test
    @Transactional
    void createDetallesWithExistingId() throws Exception {
        // Create the Detalles with an existing ID
        detalles.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDetallesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detalles)))
            .andExpect(status().isBadRequest());

        // Validate the Detalles in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCantidadIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        detalles.setCantidad(null);

        // Create the Detalles, which fails.

        restDetallesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detalles)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDetalles() throws Exception {
        // Initialize the database
        insertedDetalles = detallesRepository.saveAndFlush(detalles);

        // Get all the detallesList
        restDetallesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(detalles.getId().intValue())))
            .andExpect(jsonPath("$.[*].cantidad").value(hasItem(DEFAULT_CANTIDAD.intValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.intValue())));
    }

    @Test
    @Transactional
    void getDetalles() throws Exception {
        // Initialize the database
        insertedDetalles = detallesRepository.saveAndFlush(detalles);

        // Get the detalles
        restDetallesMockMvc
            .perform(get(ENTITY_API_URL_ID, detalles.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(detalles.getId().intValue()))
            .andExpect(jsonPath("$.cantidad").value(DEFAULT_CANTIDAD.intValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingDetalles() throws Exception {
        // Get the detalles
        restDetallesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDetalles() throws Exception {
        // Initialize the database
        insertedDetalles = detallesRepository.saveAndFlush(detalles);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the detalles
        Detalles updatedDetalles = detallesRepository.findById(detalles.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDetalles are not directly saved in db
        em.detach(updatedDetalles);
        updatedDetalles.cantidad(UPDATED_CANTIDAD).total(UPDATED_TOTAL);

        restDetallesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDetalles.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDetalles))
            )
            .andExpect(status().isOk());

        // Validate the Detalles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDetallesToMatchAllProperties(updatedDetalles);
    }

    @Test
    @Transactional
    void putNonExistingDetalles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detalles.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetallesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, detalles.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detalles))
            )
            .andExpect(status().isBadRequest());

        // Validate the Detalles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDetalles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detalles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetallesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(detalles))
            )
            .andExpect(status().isBadRequest());

        // Validate the Detalles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDetalles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detalles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetallesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(detalles)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Detalles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDetallesWithPatch() throws Exception {
        // Initialize the database
        insertedDetalles = detallesRepository.saveAndFlush(detalles);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the detalles using partial update
        Detalles partialUpdatedDetalles = new Detalles();
        partialUpdatedDetalles.setId(detalles.getId());

        restDetallesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetalles.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDetalles))
            )
            .andExpect(status().isOk());

        // Validate the Detalles in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDetallesUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedDetalles, detalles), getPersistedDetalles(detalles));
    }

    @Test
    @Transactional
    void fullUpdateDetallesWithPatch() throws Exception {
        // Initialize the database
        insertedDetalles = detallesRepository.saveAndFlush(detalles);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the detalles using partial update
        Detalles partialUpdatedDetalles = new Detalles();
        partialUpdatedDetalles.setId(detalles.getId());

        partialUpdatedDetalles.cantidad(UPDATED_CANTIDAD).total(UPDATED_TOTAL);

        restDetallesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetalles.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDetalles))
            )
            .andExpect(status().isOk());

        // Validate the Detalles in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDetallesUpdatableFieldsEquals(partialUpdatedDetalles, getPersistedDetalles(partialUpdatedDetalles));
    }

    @Test
    @Transactional
    void patchNonExistingDetalles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detalles.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetallesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, detalles.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(detalles))
            )
            .andExpect(status().isBadRequest());

        // Validate the Detalles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDetalles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detalles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetallesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(detalles))
            )
            .andExpect(status().isBadRequest());

        // Validate the Detalles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDetalles() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        detalles.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetallesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(detalles)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Detalles in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDetalles() throws Exception {
        // Initialize the database
        insertedDetalles = detallesRepository.saveAndFlush(detalles);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the detalles
        restDetallesMockMvc
            .perform(delete(ENTITY_API_URL_ID, detalles.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return detallesRepository.count();
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

    protected Detalles getPersistedDetalles(Detalles detalles) {
        return detallesRepository.findById(detalles.getId()).orElseThrow();
    }

    protected void assertPersistedDetallesToMatchAllProperties(Detalles expectedDetalles) {
        assertDetallesAllPropertiesEquals(expectedDetalles, getPersistedDetalles(expectedDetalles));
    }

    protected void assertPersistedDetallesToMatchUpdatableProperties(Detalles expectedDetalles) {
        assertDetallesAllUpdatablePropertiesEquals(expectedDetalles, getPersistedDetalles(expectedDetalles));
    }
}
