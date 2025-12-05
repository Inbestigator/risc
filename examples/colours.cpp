#include <cstdint>
#include "io.cpp"

int main()
{
    uint8_t palette[] = {0, 196, 46, 21, 226, 201, 51, 93, 244, 15};
    int i = 0;

    while (true)
    {
        output[i] = 15;
        render_frame();
        if (input[0] < '0' || input[0] > '9')
        {
            continue;
        }
        output[i] = palette[input[0] - '0'];
        ++i;
        input[0] = 0;
    }

    return 0;
}
