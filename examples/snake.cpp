#include "io.cpp"

// arrow keys
#define UP 0x415B1B
#define DOWN 0x425B1B
#define LEFT 0x445B1B
#define RIGHT 0x435B1B

#define SNAKE 15
#define APPLE 196

uint32_t rng = 1;
int rand(int max)
{
    // rng ^= rng << 13;
    // rng ^= rng >> 17;
    // rng ^= rng << 5;
    return rng++ % max;
}

int main()
{
    int x = WIDTH / 2, y = HEIGHT / 2;
    int dx = 0, dy = 0;
    int ax = rand(WIDTH), ay = rand(HEIGHT);

    int n = -1;

    while (true)
    {
        ++n;
        if (n % 500 != 0)
            continue;
        n = 0;
        pos(x, y) = SNAKE;
        pos(ax, ay) = APPLE;

        render_frame();

        uint32_t key = *input;

        switch (key)
        {
        case UP:
            dx = 0;
            dy = -1;
            break;
        case DOWN:
            dx = 0;
            dy = 1;
            break;
        case LEFT:
            dx = -1;
            dy = 0;
            break;
        case RIGHT:
            dx = 1;
            dy = 0;
            break;
        }
        input[0] = 0;

        pos(x, y) = EMPTY;

        x = (x + dx + WIDTH) % WIDTH;
        y = (y + dy + HEIGHT) % HEIGHT;

        if (pos(x, y) == SNAKE && (dx != 0 || dy != 0))
        {
            return 1;
        }

        if (x == ax && y == ay)
        {
            do
            {
                ax = rand(WIDTH);
                ay = rand(HEIGHT);
            } while (pos(ax, ay) != EMPTY);
        }
    }

    return 0;
}