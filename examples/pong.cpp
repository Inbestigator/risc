#include "io.cpp"

#define P1_UP 'w'
#define P1_DOWN 's'
#define P2_UP 0x415B1B // arrow keys
#define P2_DOWN 0x425B1B

#define PADDLE 15
#define BALL 11

#define PADDLE_HEIGHT 2

int n = -1;

int main()
{
    int p1y = (HEIGHT / 2) - 1, p2y = (HEIGHT / 2) - 1, bx = 1, by = HEIGHT / 2, dbx = 1, dby = -1;

    while (true)
    {
        ++n;
        if (n % 500 != 0)
            continue;
        n = 0;

        uint32_t key = *input;

        pos(bx, by) = BALL;

        for (int i = 0; i < PADDLE_HEIGHT; ++i)
        {
            pos(0, p1y + i) = PADDLE;
            pos(WIDTH - 1, p2y + i) = PADDLE;
        }

        render_frame();

        pos(bx, by) = EMPTY;
        for (int i = 0; i < PADDLE_HEIGHT; ++i)
        {
            pos(0, p1y + i) = EMPTY;
            pos(WIDTH - 1, p2y + i) = EMPTY;
        }

        switch (key)
        {
        case P1_UP:
            --p1y;
            break;
        case P1_DOWN:
            ++p1y;
            break;
        case P2_UP:
            --p2y;
            break;
        case P2_DOWN:
            ++p2y;
            break;
        }
        input[0] = 0;

        if ((bx + dbx < 1 && (p1y - by) < 1 && (p1y - by) > -PADDLE_HEIGHT) || (bx + dbx > WIDTH - 2 && (p2y - by) < 1 && (p2y - by) > -PADDLE_HEIGHT))
        {
            dbx *= -1;
        }
        else if (bx + dbx < 1 || bx + dbx > WIDTH - 2)
        {
            return 1;
        }

        if (by + dby < 0 || by + dby > HEIGHT - 1)
        {
            dby *= -1;
        }

        bx += dbx;
        by += dby;
    }

    return 0;
}