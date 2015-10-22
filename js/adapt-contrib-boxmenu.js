define([
    'coreJS/adapt',
    'coreViews/menuView'
], function(Adapt, MenuView) {

    var BoxMenuView = MenuView.extend({

        preRender: function() {
            if( this.model.get( '_globals' )._menu._boxmenu.sequential === true ) {
                var blLock = false;

                this.model.getChildren().each(
                    function( objMenuItem ) {
                        objMenuItem.set( '_isLocked', blLock );

                        if( !objMenuItem.get( '_isComplete' ) ) {
                            blLock = true;
                        }
                    }
                );
            }

            if( !$( 'html' ).is( '.ie6, .ie7, .ie8' ) ) {
                this.$el.css( 'opacity', 0 );
            }

            this.listenTo( this.model, 'change:_isReady', this.isReady );
        },

        postRender: function() {
            var nthChild = 0;
            this.model.getChildren().each(function(item) {
                if (item.get('_isAvailable')) {
                    nthChild++;
                    item.set("_nthChild", nthChild);
                    this.$('.menu-container-inner').append(new BoxMenuItemView({model: item}).$el);
                }
            });
        }

    }, {
        template: 'boxmenu'
    });

    var BoxMenuItemView = MenuView.extend({

        events: {
            'click .menu-item-button a.disabled': 'onClick'
        },

        className: function() {
            var nthChild = this.model.get("_nthChild");
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id') ,
                this.model.get('_isLocked') ? 'locked' : 'unlocked',
                this.model.get('_classes'),
                'nth-child-' + nthChild,
                nthChild % 2 === 0 ? 'nth-child-even' : 'nth-child-odd'
            ].join(' ');
        },

        onClick: function( e ) {
            e.preventDefault();
        },

        preRender: function() {
            this.model.checkCompletionStatus();
            this.model.checkInteractionCompletionStatus();
        },

        postRender: function() {
            this.$el.imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
        }

    }, {
        template: 'boxmenu-item'
    });

    Adapt.on('router:menu', function(model) {

        $('#wrapper').append(new BoxMenuView({model: model}).$el);

    });

});
