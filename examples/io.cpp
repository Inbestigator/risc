#include <cstdint>

#define WIDTH 36
#define HEIGHT 12

#define EMPTY 0

uint32_t *input = (uint32_t *)0x00ffff;
uint8_t *output = (uint8_t *)0xa00000;

#define pos(x, y) (output[(y) * WIDTH + (x)])

void render_frame()
{
    asm volatile("li a7, 1000");
    asm volatile("ecall");
}
