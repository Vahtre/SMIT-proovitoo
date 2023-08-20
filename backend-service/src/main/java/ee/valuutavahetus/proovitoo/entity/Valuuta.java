package ee.valuutavahetus.proovitoo.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "valuuta")
@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class Valuuta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String nimetus;

    @NonNull
    private Double kurss;

}