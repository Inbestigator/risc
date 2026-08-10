
#include "io.cpp"

#define GLYPH_H 5
#define GLYPH_W 3
#define GLYPH_SPACING 1

#define UP 0x415B1B
#define DOWN 0x425B1B

const uint8_t font[62][GLYPH_H][GLYPH_W] = {
    {{15, 15, 15}, {15, 0, 15}, {15, 15, 15}, {15, 0, 15}, {15, 0, 15}},  // A
    {{15, 15, 15}, {15, 0, 15}, {15, 15, 0}, {15, 0, 15}, {15, 15, 15}},  // B
    {{0, 15, 15}, {15, 0, 0}, {15, 0, 0}, {15, 0, 0}, {0, 15, 15}},       // C
    {{15, 15, 0}, {15, 0, 15}, {15, 0, 15}, {15, 0, 15}, {15, 15, 15}},   // D
    {{15, 15, 15}, {15, 0, 0}, {15, 15, 0}, {15, 0, 0}, {15, 15, 15}},    // E
    {{15, 15, 15}, {15, 0, 0}, {15, 15, 0}, {15, 0, 0}, {15, 0, 0}},      // F
    {{0, 15, 15}, {15, 0, 0}, {15, 0, 0}, {15, 0, 15}, {15, 15, 15}},     // G
    {{15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {15, 0, 15}, {15, 0, 15}},   // H
    {{15, 15, 15}, {0, 15, 0}, {0, 15, 0}, {0, 15, 0}, {15, 15, 15}},     // I
    {{15, 15, 15}, {0, 15, 0}, {0, 15, 0}, {0, 15, 0}, {15, 15, 0}},      // J
    {{15, 0, 15}, {15, 0, 15}, {15, 15, 0}, {15, 0, 15}, {15, 0, 15}},    // K
    {{15, 0, 0}, {15, 0, 0}, {15, 0, 0}, {15, 0, 0}, {15, 15, 15}},       // L
    {{15, 15, 15}, {15, 15, 15}, {15, 0, 15}, {15, 0, 15}, {15, 0, 15}},  // M
    {{15, 15, 0}, {15, 0, 15}, {15, 0, 15}, {15, 0, 15}, {15, 0, 15}},    // N
    {{0, 15, 15}, {15, 0, 15}, {15, 0, 15}, {15, 0, 15}, {15, 15, 0}},    // O
    {{15, 15, 15}, {15, 0, 15}, {15, 15, 15}, {15, 0, 0}, {15, 0, 0}},    // P
    {{0, 15, 0}, {15, 0, 15}, {15, 0, 15}, {15, 15, 0}, {0, 15, 15}},     // Q
    {{15, 15, 15}, {15, 0, 15}, {15, 15, 0}, {15, 0, 15}, {15, 0, 15}},   // R
    {{0, 15, 15}, {15, 0, 0}, {15, 15, 15}, {0, 0, 15}, {15, 15, 0}},     // S
    {{15, 15, 15}, {0, 15, 0}, {0, 15, 0}, {0, 15, 0}, {0, 15, 0}},       // T
    {{15, 0, 15}, {15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {0, 15, 15}},   // U
    {{15, 0, 15}, {15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {0, 15, 0}},    // V
    {{15, 0, 15}, {15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {15, 15, 15}},  // W
    {{15, 0, 15}, {15, 0, 15}, {0, 15, 0}, {15, 0, 15}, {15, 0, 15}},     // X
    {{15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {0, 0, 15}, {15, 15, 15}},   // Y
    {{15, 15, 15}, {0, 0, 15}, {0, 15, 0}, {15, 0, 0}, {15, 15, 15}},     // Z
    {{0, 0, 0}, {15, 15, 15}, {15, 0, 15}, {15, 15, 15}, {15, 0, 15}},    // a
    {{0, 0, 0}, {15, 15, 0}, {15, 15, 0}, {15, 0, 15}, {15, 15, 15}},     // b
    {{0, 0, 0}, {15, 15, 15}, {15, 0, 0}, {15, 0, 0}, {15, 15, 15}},      // c
    {{0, 0, 0}, {15, 15, 0}, {15, 0, 15}, {15, 0, 15}, {15, 15, 0}},      // d
    {{0, 0, 0}, {15, 15, 15}, {15, 15, 0}, {15, 0, 0}, {15, 15, 15}},     // e
    {{0, 0, 0}, {15, 15, 15}, {15, 15, 0}, {15, 0, 0}, {15, 0, 0}},       // f
    {{0, 0, 0}, {15, 15, 15}, {15, 0, 0}, {15, 0, 15}, {15, 15, 15}},     // g
    {{0, 0, 0}, {15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {15, 0, 15}},     // h
    {{0, 0, 0}, {15, 15, 15}, {0, 15, 0}, {0, 15, 0}, {15, 15, 15}},      // i
    {{0, 0, 0}, {15, 15, 15}, {0, 15, 0}, {0, 15, 0}, {15, 15, 0}},       // j
    {{0, 0, 0}, {15, 0, 15}, {15, 15, 0}, {15, 0, 15}, {15, 0, 15}},      // k
    {{0, 0, 0}, {15, 0, 0}, {15, 0, 0}, {15, 0, 0}, {15, 15, 15}},        // l
    {{0, 0, 0}, {15, 15, 15}, {15, 15, 15}, {15, 0, 15}, {15, 0, 15}},    // m
    {{0, 0, 0}, {15, 15, 0}, {15, 0, 15}, {15, 0, 15}, {15, 0, 15}},      // n
    {{0, 0, 0}, {0, 15, 15}, {15, 0, 15}, {15, 0, 15}, {15, 15, 0}},      // o
    {{0, 0, 0}, {15, 15, 15}, {15, 0, 15}, {15, 15, 15}, {15, 0, 0}},     // p
    {{0, 0, 0}, {0, 15, 0}, {15, 0, 15}, {15, 15, 0}, {0, 15, 15}},       // q
    {{0, 0, 0}, {15, 15, 15}, {15, 0, 15}, {15, 15, 0}, {15, 0, 15}},     // r
    {{0, 0, 0}, {0, 15, 15}, {15, 0, 0}, {0, 0, 15}, {15, 15, 0}},        // s
    {{0, 0, 0}, {15, 15, 15}, {0, 15, 0}, {0, 15, 0}, {0, 15, 0}},        // t
    {{0, 0, 0}, {15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {0, 15, 15}},     // u
    {{0, 0, 0}, {15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {0, 15, 0}},      // v
    {{0, 0, 0}, {15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {15, 15, 15}},    // w
    {{0, 0, 0}, {15, 0, 15}, {0, 15, 0}, {15, 0, 15}, {15, 0, 15}},       // x
    {{0, 0, 0}, {15, 0, 15}, {15, 15, 15}, {0, 0, 15}, {15, 15, 15}},     // y
    {{0, 0, 0}, {15, 15, 15}, {0, 0, 15}, {15, 0, 0}, {15, 15, 15}},      // z
    {{15, 15, 15}, {15, 0, 15}, {15, 0, 15}, {15, 0, 15}, {15, 15, 15}},  // 0
    {{15, 15, 0}, {0, 15, 0}, {0, 15, 0}, {0, 15, 0}, {15, 15, 15}},      // 1
    {{15, 15, 15}, {0, 0, 15}, {15, 15, 15}, {15, 0, 0}, {15, 15, 15}},   // 2
    {{15, 15, 15}, {0, 0, 15}, {0, 15, 15}, {0, 0, 15}, {15, 15, 15}},    // 3
    {{15, 0, 15}, {15, 0, 15}, {15, 15, 15}, {0, 0, 15}, {0, 0, 15}},     // 4
    {{15, 15, 15}, {15, 0, 0}, {15, 15, 15}, {0, 0, 15}, {15, 15, 15}},   // 5
    {{15, 0, 0}, {15, 0, 0}, {15, 15, 15}, {15, 0, 15}, {15, 15, 15}},    // 6
    {{15, 15, 15}, {0, 0, 15}, {0, 0, 15}, {0, 0, 15}, {0, 0, 15}},       // 7
    {{15, 15, 15}, {15, 0, 15}, {15, 15, 15}, {15, 0, 15}, {15, 15, 15}}, // 8
    {{15, 15, 15}, {15, 0, 15}, {15, 15, 15}, {0, 0, 15}, {0, 0, 15}},    // 9
};

void draw_char(char c, int x, int y)
{
    int index;

    if (c >= 'A' && c <= 'Z')
        index = c - 'A';
    else if (c >= 'a' && c <= 'z')
        index = 26 + (c - 'a');
    else if (c >= '0' && c <= '9')
        index = 52 + (c - '0');
    else
        return;

    for (int row = 0; row < GLYPH_H; ++row)
    {
        for (int col = 0; col < GLYPH_W; ++col)
        {
            int px = x + col;
            int py = y + row;

            if (px >= 0 && px < WIDTH &&
                py >= 0 && py < HEIGHT)
            {
                pos(px, py) = font[index][row][col];
            }
        }
    }
}

void draw_char_row(char c, int x, int y, int glyph_row)
{
    int index;

    if (c >= 'A' && c <= 'Z')
        index = c - 'A';
    else if (c >= 'a' && c <= 'z')
        index = 26 + (c - 'a');
    else if (c >= '0' && c <= '9')
        index = 52 + (c - '0');
    else
        return;

    if (glyph_row < 0 || glyph_row >= GLYPH_H)
        return;

    for (int col = 0; col < GLYPH_W; ++col)
    {
        int px = x + col;

        if (px >= 0 && px < WIDTH &&
            y >= 0 && y < HEIGHT)
        {
            pos(px, y) = font[index][glyph_row][col];
        }
    }
}

struct CharPos
{
    int x;
    int y;
    char c;
};

void scroll(
    int amount,
    int &scroll_y,
    const CharPos history[],
    int history_count)
{
    while (amount != 0)
    {
        if (amount < 0)
        {
            for (int py = HEIGHT - 1; py > 0; --py)
            {
                for (int px = 0; px < WIDTH; ++px)
                {
                    pos(px, py) = pos(px, py - 1);
                }
            }

            for (int px = 0; px < WIDTH; ++px)
                output[px] = 0;

            --scroll_y;

            int document_y = scroll_y;

            for (int i = 0; i < history_count; ++i)
            {
                int glyph_y = history[i].y;

                if (document_y >= glyph_y &&
                    document_y < glyph_y + GLYPH_H)
                {
                    draw_char_row(
                        history[i].c,
                        history[i].x,
                        0,
                        document_y - glyph_y);
                }
            }

            ++amount;
        }
        else
        {
            for (int py = 0; py < HEIGHT - 1; ++py)
            {
                for (int px = 0; px < WIDTH; ++px)
                {
                    pos(px, py) = pos(px, py + 1);
                }
            }

            for (int px = 0; px < WIDTH; ++px)
            {
                output[(HEIGHT - 1) * WIDTH + px] = 0;
            }

            ++scroll_y;

            int document_y = scroll_y + HEIGHT - 1;

            for (int i = 0; i < history_count; ++i)
            {
                int glyph_y = history[i].y;

                if (document_y >= glyph_y &&
                    document_y < glyph_y + GLYPH_H)
                {
                    draw_char_row(
                        history[i].c,
                        history[i].x,
                        HEIGHT - 1,
                        document_y - glyph_y);
                }
            }

            --amount;
        }
    }
}

int get_max_scroll(
    int doc_y,
    const CharPos history[],
    int history_count)
{
    int max_y = doc_y;

    if (history_count > 0)
    {
        int last_y = history[history_count - 1].y;

        if (last_y > max_y)
            max_y = last_y;
    }

    int max_scroll = max_y + GLYPH_H - HEIGHT;

    return max_scroll > 0 ? max_scroll : 0;
}

int main()
{
    const int LINE_H = GLYPH_H + 1;
    const int MAX_CHARS = WIDTH * HEIGHT * 16;

    CharPos history[MAX_CHARS];
    int history_count = 0;

    int x = 0;
    int doc_y = 0;
    int scroll_y = 0;

    render_frame();

    while (true)
    {
        if (input[0] == 0)
            continue;

        int key = input[0];

        if (key == UP)
        {
            if (scroll_y > 0)
                scroll(-1, scroll_y, history, history_count);

            input[0] = 0;
            render_frame();
            continue;
        }

        if (key == DOWN)
        {
            int max_scroll =
                get_max_scroll(doc_y, history, history_count);

            if (scroll_y < max_scroll)
                scroll(1, scroll_y, history, history_count);

            input[0] = 0;
            render_frame();
            continue;
        }

        if (key == '\b' || key == 127)
        {
            if (history_count > 0)
            {
                --history_count;

                x = history[history_count].x;
                doc_y = history[history_count].y;

                for (int row = 0; row < GLYPH_H; ++row)
                {
                    int py = history[history_count].y - scroll_y + row;

                    if (py < 0 || py >= HEIGHT)
                        continue;

                    for (int col = 0; col < GLYPH_W; ++col)
                    {
                        int px = history[history_count].x + col;

                        if (px >= 0 && px < WIDTH)
                            pos(px, py) = 0;
                    }
                }

                while (scroll_y > doc_y)
                    scroll(-1, scroll_y, history, history_count);

                while (doc_y + GLYPH_H > scroll_y + HEIGHT)
                    scroll(1, scroll_y, history, history_count);
            }

            input[0] = 0;
            render_frame();
            continue;
        }

        if (history_count < MAX_CHARS)
        {
            history[history_count].x = x;
            history[history_count].y = doc_y;
            history[history_count].c = key;

            draw_char(key, x, doc_y - scroll_y);

            ++history_count;

            x += GLYPH_W + GLYPH_SPACING;
        }

        if (x + GLYPH_W > WIDTH)
        {
            x = 0;
            doc_y += LINE_H;
        }

        if (doc_y + GLYPH_H > scroll_y + HEIGHT)
        {
            int amount = doc_y + GLYPH_H - (scroll_y + HEIGHT);

            scroll(amount, scroll_y, history, history_count);
        }

        input[0] = 0;
        render_frame();
    }

    return 0;
}
