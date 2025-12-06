#include "io.cpp"

#define UP 'w'
#define DOWN 's'
#define LEFT 'a'
#define RIGHT 'd'

#define SNAKE 15
#define APPLE 196
#define MAX_SNAKE_LENGTH (WIDTH * HEIGHT)

uint32_t rng = 1;
int rand(int max)
{
    return rng++ % max;
}

struct Node
{
    int x, y;
};

int main()
{
    int x = WIDTH / 2, y = HEIGHT / 2;
    int dx = 0, dy = 0;
    int ax = rand(WIDTH), ay = rand(HEIGHT);

    Node snake[MAX_SNAKE_LENGTH];
    int snake_length = 1;
    snake[0] = {x, y};

    int n = -1;

    while (true)
    {
        ++n;
        if (n % 500 != 0)
            continue;
        n = 0;

        pos(snake[snake_length - 1].x, snake[snake_length - 1].y) = SNAKE;
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

        x = (x + dx + WIDTH) % WIDTH;
        y = (y + dy + HEIGHT) % HEIGHT;

        if (pos(x, y) == SNAKE && snake_length > 1)
        {
            return 1;
        }

        pos(snake[0].x, snake[0].y) = EMPTY;

        for (int i = 0; i < snake_length - 1; ++i)
        {
            snake[i] = snake[i + 1];
        }

        snake[snake_length - 1] = {x, y};

        if (x == ax && y == ay)
        {
            if (snake_length < MAX_SNAKE_LENGTH)
            {
                snake[snake_length++] = {x, y};
            }
            do
            {
                ax = rand(WIDTH);
                ay = rand(HEIGHT);
            } while (pos(ax, ay) != EMPTY);
        }
    }

    return 0;
}