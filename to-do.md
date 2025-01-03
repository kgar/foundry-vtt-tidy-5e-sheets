## To Do

## Scratchpad

```svelte
<script>
	import { onMount } from 'svelte';
	
	let name = 'world';
	let rootEl;
	let observedEl;
	let marker;
	
	onMount(() => {
		const observer = new IntersectionObserver((entries, o) => {
			for (const entry of entries) {
				entry.target.classList.toggle(
					'fred', !entry.isIntersecting);
			}
		}, {
			root: rootEl
		});

		observer.observe(observedEl);
		observer.observe(marker);

		return () => {
			observer.disconnect();
		}
	});
</script>


<div bind:this={rootEl} class="some-container">
	<div bind:this={marker} class="marker"></div>
	<h1 bind:this={observedEl}>Hello {name}!</h1>
	<p>Lorem ipsum osdasdasdor amet, consectetuer adipiscing elit. Maecenas nam purus dis pellentesque id. Per lacinia dui enim venenatis dui rhoncus. Maecenas faucibus placerat inceptos purus mattis metus pretium. Lectus per lacus aliquet elit imperdiet dui placerat. Purus lorem justo consectetur tempus ridiculus. Curae interdum proin lacinia ex finibus in luctus ornare vehicula. Senectus pharetra eget sapien platea risus quam cursus iaculis tortor!</p><p>Elit sagittis mattis tempus cubilia mattis litora. Ante duis ut orci mattis fames sodales; lacinia commodo semper. Ex habitant senectus praesent nascetur commodo interdum augue blandit. Mollis netus dapibus senectus, vivamus facilisi nullam. Malesuada id dui posuere ante lectus ullamcorper consectetur interdum vivamus. Auctor dapibus dis et aliquet facilisis dolor vulputate massa. Himenaeos erat velit suspendisse, class arcu ornare sapien et. Amet malesuada dui nibh finibus sed commodo. Morbi interdum risus tempus aenean volutpat ut ridiculus nascetur.</p><p>Risus adipiscing euismod massa primis libero iaculis ligula nostra? Diam convallis quis cras ante diam sem. Leo inceptos commodo molestie ac lobortis dis dictum. Porta ipsum faucibus cubilia dictumst purus, sed viverra eu libero. Tortor cras scelerisque libero tellus sit turpis. Sem cursus posuere lacus vitae ornare. Justo nascetur curabitur laoreet erat posuere feugiat commodo nam. Molestie luctus nullam; nibh sapien ad orci phasellus sollicitudin. Per metus mi posuere condimentum orci.</p><p>Mauris metus pulvinar dolor penatibus morbi netus vehicula. Augue fringilla vitae, venenatis mi nunc id sociosqu. Nec per commodo nam facilisi rhoncus viverra. Dapibus platea enim augue malesuada consequat phasellus gravida cubilia sollicitudin. Ligula dapibus parturient dis aptent sollicitudin facilisis accumsan. Quis torquent commodo curabitur cras odio aenean litora aptent. Felis aliquet taciti volutpat netus gravida tempus.</p><p>Nostra magna et sit bibendum vivamus faucibus. Ipsum mollis quis arcu natoque efficitur facilisis. Lacus urna tincidunt tellus dui auctor semper. Feugiat rutrum class facilisis egestas tempus. Et sapien ex nullam felis class lacus. Lectus urna fusce nibh fusce nam commodo curabitur. Vulputate tristique id magna; nam vel volutpat torquent! Porttitor tincidunt eget fringilla venenatis sociosqu nibh sit.</p><p>Nec consectetur litora praesent odio congue. Ullamcorper arcu odio platea molestie augue at. Nam quisque sed urna curabitur tortor? Enim tempus aenean parturient est nisl. Mattis ipsum vestibulum ut sapien, ac lacinia congue vel id. Efficitur ligula velit urna eleifend; congue porta. Accumsan eget aptent felis suscipit est odio. Accumsan in nec pharetra adipiscing consectetur lectus egestas phasellus. Ridiculus platea duis, donec aliquam eros hendrerit.</p><p>Laoreet dictum mi ornare tempus magnis penatibus ut? Blandit taciti lectus faucibus laoreet; cursus etiam massa diam. Efficitur rhoncus inceptos imperdiet euismod nec sit nisl vivamus. Lorem tincidunt tortor hendrerit fermentum nibh in quisque. Ante cubilia iaculis duis venenatis praesent ultricies a ornare. Primis porta tortor dignissim montes nec litora aenean vel. Curabitur nunc nascetur elit mollis odio non. Rhoncus dis netus iaculis odio venenatis sociosqu tellus. Pharetra iaculis dolor enim lacinia morbi magnis nisl maecenas.</p><p>Dis quam sed morbi aliquet ligula pretium libero. Pharetra dapibus tempus lorem; senectus donec morbi pharetra. Scelerisque semper risus rhoncus; magna erat at? Dapibus iaculis maximus cras ultricies leo. Quam nisi potenti rhoncus curabitur eget eu potenti integer. Condimentum venenatis eget efficitur nec mattis per nibh. Pulvinar maximus maximus consequat eleifend nascetur auctor volutpat parturient et. Integer elementum congue conubia fusce justo turpis quis justo ante.</p><p>Feugiat habitant senectus vitae vivamus aliquam venenatis. Ipsum ac accumsan vel erat rhoncus. Ultricies natoque ex eleifend placerat ad per taciti. Senectus nisi metus id rhoncus eleifend lacus himenaeos enim consequat. Augue tempor penatibus habitasse nam consequat urna potenti lectus. Egestas iaculis pellentesque habitant aliquam rutrum. At vehicula natoque tortor penatibus vivamus morbi. Blandit rutrum magna a dictumst sed lectus.</p><p>Proin dolor tincidunt scelerisque, vivamus a accumsan imperdiet aptent. Luctus conubia mi faucibus vehicula varius aliquam; ultrices eget tempor. Diam pretium est tristique bibendum dignissim egestas ultricies. Scelerisque pharetra turpis nisl posuere potenti bibendum faucibus vestibulum. Ornare dui litora felis at per ut nam. Bibendum ut consequat morbi phasellus vestibulum accumsan elementum ex.</p><p>Imperdiet vulputate suscipit primis; phasellus mus leo vivamus. Vulputate morbi maecenas potenti libero lobortis sed dapibus sed malesuada. Per nec morbi ad vulputate nullam, mattis quis per. Varius vestibulum lacus cubilia semper felis imperdiet aenean nulla. Quisque nunc accumsan mi fames fames ante fermentum placerat. Dolor class vehicula ullamcorper metus; fringilla ipsum tempus ipsum. Fringilla turpis felis et aptent consectetur tincidunt massa.</p><p>Auctor gravida consequat aliquam in litora scelerisque senectus. Cras porttitor ligula pellentesque malesuada, posuere penatibus. Curabitur massa elit vulputate senectus vulputate placerat hac tempor. Tristique sapien euismod interdum placerat curabitur tincidunt nec conubia. Sociosqu nisi sapien justo, rutrum pretium accumsan vehicula justo ante. Diam cursus lacus lorem gravida non eget ut montes auctor. Nec nibh volutpat laoreet feugiat justo; massa aliquet. Euismod magna ut turpis aliquet curae cubilia mollis et. Elementum sapien duis aenean neque amet aliquam maecenas erat. Justo odio sit ultrices finibus lobortis integer ullamcorper auctor?</p><p>Justo eleifend eu placerat aenean montes iaculis. Commodo semper neque consectetur efficitur; integer nulla torquent. Hac platea nullam ultricies tellus per integer varius. Class litora sapien hac mauris imperdiet. Felis sed lectus faucibus purus iaculis facilisi pharetra praesent. Cras etiam sapien elit per commodo ex himenaeos volutpat accumsan. In efficitur venenatis aliquet amet sagittis primis urna.</p><p>Velit fames lobortis neque; gravida praesent nibh. Phasellus pharetra aptent dis mi massa. Finibus turpis quam dolor nam elit libero dictum. Dictumst metus pulvinar aliquam lectus euismod tempor ante nascetur. Hac parturient class feugiat pharetra lorem. In facilisi quisque himenaeos imperdiet finibus tristique cras. Suscipit potenti id sodales; mus facilisis nunc sit. Pharetra nulla mus torquent; pellentesque facilisi hendrerit. Aenean justo iaculis commodo convallis tristique.</p><p>Phasellus dignissim risus enim donec; velit tellus ipsum. Commodo commodo accumsan ultricies malesuada sociosqu varius. Nisl a tristique habitasse condimentum senectus nullam. Platea eleifend commodo integer ullamcorper egestas eu. Fringilla tempus inceptos; maximus pellentesque et cras. Duis mattis eu cursus ornare ante montes luctus odio. Pharetra vestibulum massa id arcu dui vitae quam taciti? Aenean senectus convallis curae fringilla facilisi at suspendisse proin. Cursus sed urna dolor arcu taciti nostra id.</p><p>Leo risus tincidunt lobortis facilisis laoreet. Nam donec eu duis nisl; at gravida turpis magna. Non dignissim ornare quam et senectus tempus vestibulum. Aliquam felis pellentesque natoque elit fames. Faucibus orci pulvinar a feugiat morbi sollicitudin. Congue iaculis primis mattis dolor tristique. Consequat felis nostra adipiscing; suscipit tempus inceptos. Praesent tempus tortor ad eleifend rhoncus aptent dictumst.</p><p>Mattis torquent auctor dignissim purus aliquet. Sed tortor vulputate diam cursus elementum. Habitasse vitae porta enim vel ipsum rutrum neque. Risus efficitur lobortis nec consectetur duis; fames varius elit? Sollicitudin sagittis facilisis habitasse accumsan potenti. Elit nam integer sodales cubilia dis amet convallis.</p><p>Finibus viverra finibus elementum pellentesque hendrerit etiam scelerisque proin pretium. Metus fermentum himenaeos mus euismod primis proin blandit. In porttitor volutpat malesuada a lobortis. Ut nec nascetur sapien vel facilisi. Ligula integer felis blandit porttitor platea justo dui. Mus faucibus ligula ut vehicula enim iaculis.</p><p>Sociosqu lacus justo penatibus malesuada eleifend praesent vestibulum dictumst. Tellus pulvinar tempor nam nisl cursus. Feugiat eros elementum risus a nisi primis accumsan. Feugiat ex class in duis, ornare a maecenas. Suscipit lacinia magnis lobortis, convallis maximus auctor donec senectus. Fames turpis magna leo non faucibus varius quam integer diam. Cubilia quis magna tincidunt ornare morbi blandit accumsan tempor nostra. Torquent litora dictum fusce curae libero hendrerit semper nec. Mattis primis accumsan gravida nascetur cras aliquam.</p><p>Venenatis a posuere odio commodo metus. Eleifend at dignissim etiam montes blandit curabitur erat. Metus erat bibendum molestie vel mi non lectus per. Dolor sodales neque litora montes ante nam scelerisque. Turpis a finibus natoque nec vel fames lacus. Quis porttitor pharetra elementum penatibus leo amet. Nibh ipsum sit eget duis tempor; senectus sodales per.</p>
</div>

<style>
	.some-container {
		overflow-y: scroll;
		height: 100%;
	}
	
	:global(.some-container:has(.marker.fred) p) {
		background: red;
	}

	:global(.some-container:has(h1.fred) p) {
		color: blue;
	}
	
</style>
```
