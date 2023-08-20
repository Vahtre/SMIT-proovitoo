package ee.valuutavahetus.proovitoo.repository;

import ee.valuutavahetus.proovitoo.entity.Valuuta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ValuutaRepository extends JpaRepository<Valuuta, Long> {

    Optional<Valuuta> findByNimetus(String nimetus);
    List<Valuuta> findAll();

}
