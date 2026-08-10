#include "io.cpp"

int main()
{
    int i = 32;

    int a = 0;
    int b = 1;

    *output++ = a;
    *output++ = b;

    while (i > 2)
    {
        int next = a + b;
        *output++ = next;

        a = b;
        b = next;

        --i;
    }

    render_frame();

    return 0;
}
