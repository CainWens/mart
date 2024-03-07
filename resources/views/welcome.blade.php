@extends('layouts.app')

@section('content')
{{--    <e-mart></e-mart>--}}
<div class="flex items-center align-center justify-center py-32 mx-auto h-full w-full lg:w-2/6">
    <div class="collapse">
        <input type="checkbox" />
        <div class="collapse-title">
            <canvas id="cnv" class="w-1/2 h-1/2 lg:w-full lg:h-full"></canvas>
        </div>
        <div class="collapse-content text-black">
            <p id="appload" class="text-center text-4xl bg-green-900 bg-opacity-10 rounded-2xl">
                Пусть весна подарит счастье,<br>
                Настроение и успех.<br>
                Пусть обходят вас ненастья,<br>
                И звучит почаще смех!<br>
<br>
                Наслаждайтесь, улыбайтесь.<br>
                Оптимизма и добра.<br>
                С праздником 8 Марта!<br>
                Вы прекрасны, как всегда!<br>
            </p>
        </div>
    </div>

</div>

@endsection
