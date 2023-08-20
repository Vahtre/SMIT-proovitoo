package ee.valuutavahetus.proovitoo.dto;

import ee.valuutavahetus.proovitoo.entity.User;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserDto {
    private Long id;
    private String username;

    public static UserDto from(User user){
        return builder().id(Long.valueOf(user.getId())).username(user.getUsername()).build();
    }
}
